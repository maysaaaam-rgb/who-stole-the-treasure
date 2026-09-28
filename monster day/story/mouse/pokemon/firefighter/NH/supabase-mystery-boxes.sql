-- =============================================================================
-- ENGLISH ADVENTURE ACADEMY — MYSTERY BOXES, INVENTORY & TRADING SCHEMA
-- Production Supabase PostgreSQL Schema & RPC Migration (v1.0)
-- =============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 1. CATALOG ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.catalog_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    icon_url TEXT,
    in_box_pool BOOLEAN NOT NULL DEFAULT true,
    drop_weight INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. STUDENT INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.student_inventory (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    student_id TEXT NOT NULL,
    item_id TEXT NOT NULL REFERENCES public.catalog_items(id) ON DELETE CASCADE,
    is_equipped BOOLEAN NOT NULL DEFAULT false,
    quantity INTEGER NOT NULL DEFAULT 1,
    acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_student_item UNIQUE (student_id, item_id)
);

-- 3. MYSTERY BOXES TABLE
CREATE TABLE IF NOT EXISTS public.mystery_boxes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    student_id TEXT NOT NULL,
    box_tier TEXT NOT NULL DEFAULT 'WOODEN' CHECK (box_tier IN ('WOODEN', 'GILDED', 'CELESTIAL')),
    is_opened BOOLEAN NOT NULL DEFAULT false,
    opened_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TRADES & GIFTING TABLE
CREATE TABLE IF NOT EXISTS public.trades (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    sender_item_id TEXT NOT NULL,
    receiver_item_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    message TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_inventory_student ON public.student_inventory(student_id);
CREATE INDEX IF NOT EXISTS idx_mystery_boxes_student ON public.mystery_boxes(student_id);
CREATE INDEX IF NOT EXISTS idx_mystery_boxes_opened ON public.mystery_boxes(is_opened);
CREATE INDEX IF NOT EXISTS idx_trades_sender ON public.trades(sender_id);
CREATE INDEX IF NOT EXISTS idx_trades_receiver ON public.trades(receiver_id);
CREATE INDEX IF NOT EXISTS idx_trades_status ON public.trades(status);

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mystery_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow anon read catalog_items" ON public.catalog_items;
    DROP POLICY IF EXISTS "Allow anon all catalog_items" ON public.catalog_items;
    DROP POLICY IF EXISTS "Allow anon all student_inventory" ON public.student_inventory;
    DROP POLICY IF EXISTS "Allow anon all mystery_boxes" ON public.mystery_boxes;
    DROP POLICY IF EXISTS "Allow anon all trades" ON public.trades;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

CREATE POLICY "Allow anon all catalog_items" ON public.catalog_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all student_inventory" ON public.student_inventory FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all mystery_boxes" ON public.mystery_boxes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all trades" ON public.trades FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- =============================================================================
-- 5. STORED PROCEDURE: open_mystery_box(box_id, student_id)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.open_mystery_box(
    p_box_id TEXT,
    p_student_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_box RECORD;
    v_target_rarity TEXT;
    v_roll NUMERIC;
    v_item RECORD;
    v_is_duplicate BOOLEAN := false;
    v_bonus_xp INTEGER := 0;
    v_existing_inv RECORD;
BEGIN
    -- 1. Validate Box Exists, belongs to student, and is not already opened
    SELECT * INTO v_box
    FROM public.mystery_boxes
    WHERE id = p_box_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Mystery box not found');
    END IF;

    IF v_box.student_id <> p_student_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'This box does not belong to the student');
    END IF;

    IF v_box.is_opened THEN
        RETURN jsonb_build_object('success', false, 'error', 'Mystery box has already been opened');
    END IF;

    -- 2. Determine target rarity based on Box Tier weights:
    --    WOODEN: 70% Common, 30% Rare
    --    GILDED: 65% Rare, 35% Epic
    --    CELESTIAL: 60% Epic, 40% Legendary
    v_roll := random() * 100.0;

    IF v_box.box_tier = 'WOODEN' THEN
        IF v_roll < 70.0 THEN
            v_target_rarity := 'common';
        ELSE
            v_target_rarity := 'rare';
        END IF;
    ELSIF v_box.box_tier = 'GILDED' THEN
        IF v_roll < 65.0 THEN
            v_target_rarity := 'rare';
        ELSE
            v_target_rarity := 'epic';
        END IF;
    ELSE -- CELESTIAL
        IF v_roll < 60.0 THEN
            v_target_rarity := 'epic';
        ELSE
            v_target_rarity := 'legendary';
        END IF;
    END IF;

    -- 3. Select random item matching target rarity and in_box_pool
    SELECT * INTO v_item
    FROM public.catalog_items
    WHERE rarity = v_target_rarity AND in_box_pool = true
    ORDER BY (random() * drop_weight) DESC
    LIMIT 1;

    -- Fallback: if no item found with target rarity, get any in_box_pool item
    IF NOT FOUND THEN
        SELECT * INTO v_item
        FROM public.catalog_items
        WHERE in_box_pool = true
        ORDER BY random()
        LIMIT 1;
    END IF;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'No available items in the box drop pool');
    END IF;

    -- 4. Check for duplicate in student_inventory
    SELECT * INTO v_existing_inv
    FROM public.student_inventory
    WHERE student_id = p_student_id AND item_id = v_item.id;

    IF FOUND THEN
        v_is_duplicate := true;
        v_bonus_xp := 50;

        -- Increment quantity
        UPDATE public.student_inventory
        SET quantity = quantity + 1
        WHERE student_id = p_student_id AND item_id = v_item.id;

        -- Record XP audit transaction
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'xp_transactions') THEN
            INSERT INTO public.xp_transactions (id, student_id, amount, reason, category, icon, date, timestamp, source)
            VALUES (
                gen_random_uuid()::text,
                p_student_id,
                50,
                'Mystery Box Duplicate Bonus (' || v_item.name || ')',
                'positive',
                '⭐',
                CURRENT_DATE::text,
                NOW(),
                'mystery-box'
            );
        END IF;

        -- Increment student total XP if students table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'students') THEN
            UPDATE public.students
            SET xp = xp + 50, updated_at = NOW()
            WHERE id = p_student_id;
        END IF;
    ELSE
        -- Insert new item into student_inventory
        INSERT INTO public.student_inventory (student_id, item_id, is_equipped, quantity, acquired_at)
        VALUES (p_student_id, v_item.id, false, 1, NOW());
    END IF;

    -- 5. Mark box opened
    UPDATE public.mystery_boxes
    SET is_opened = true, opened_at = NOW()
    WHERE id = p_box_id;

    -- 6. Return structured response payload
    RETURN jsonb_build_object(
        'success', true,
        'box_id', p_box_id,
        'box_tier', v_box.box_tier,
        'item', jsonb_build_object(
            'id', v_item.id,
            'name', v_item.name,
            'category', v_item.category,
            'rarity', v_item.rarity,
            'icon_url', v_item.icon_url
        ),
        'is_duplicate', v_is_duplicate,
        'bonus_xp', v_bonus_xp,
        'opened_at', NOW()
    );
END;
$$;

-- =============================================================================
-- 6. SEED DATA FOR CATALOG ITEMS
-- =============================================================================
INSERT INTO public.catalog_items (id, name, category, rarity, icon_url, in_box_pool, drop_weight)
VALUES
    -- Common Items
    ('body-blue', 'Sky Blue Fur', 'body', 'common', '💙', true, 10),
    ('body-pink', 'Berry Pink Coat', 'body', 'common', '🌸', true, 10),
    ('body-green', 'Leaf Green Skin', 'body', 'common', '🍃', true, 10),
    ('eyes-happy', 'Happy Crescents', 'eyes', 'common', '😄', true, 12),
    ('eyes-sleepy', 'Sleepy Eyes', 'eyes', 'common', '😴', true, 10),
    ('mouth-smile', 'Happy Smile', 'mouth', 'common', '😺', true, 12),
    ('mouth-open', 'Excited Roar', 'mouth', 'common', '😃', true, 10),
    ('horns-sprout', 'Sprout Nubs', 'horns', 'common', '🌱', true, 10),
    ('hat-cap', 'Explorer Cap', 'hat', 'common', '🧢', true, 10),
    ('acc-badge-bronson', 'Bronze Adventure Badge', 'accessory', 'common', '🥉', true, 10),

    -- Rare Items
    ('eyes-wink', 'Curious Wink', 'eyes', 'rare', '😉', true, 8),
    ('eyes-brave', 'Brave Hero Eyes', 'eyes', 'rare', '😎', true, 8),
    ('eyes-star', 'Starry Eyes', 'eyes', 'rare', '🤩', true, 8),
    ('mouth-cheer', 'Big Cheerful Grin', 'mouth', 'rare', '😁', true, 8),
    ('horns-curved', 'Ram Curved Horns', 'horns', 'rare', '🐏', true, 8),
    ('wings-pixie', 'Pixie Sparkle Wings', 'wings', 'rare', '🧚', true, 8),
    ('tail-bushy', 'Bushy Fox Tail', 'tail', 'rare', '🦊', true, 8),
    ('hat-detective', 'Sherlock Hound Hat', 'hat', 'rare', '🕵️', true, 8),
    ('glasses-goggles', 'Brass Flying Goggles', 'glasses', 'rare', '🥽', true, 8),
    ('backpack-explorer', 'Leather Field Rucksack', 'backpack', 'rare', '🎒', true, 8),
    ('clothing-scout-vest', 'Scout Badge Vest', 'clothing', 'rare', '🦺', true, 8),

    -- Epic Items
    ('body-gold', 'Royal Gold Sheen', 'body', 'epic', '👑', true, 5),
    ('eyes-dragon', 'Dragon Ember Eyes', 'eyes', 'epic', '🔥', true, 5),
    ('horns-crystal', 'Prismatic Crystal Horns', 'horns', 'epic', '💎', true, 5),
    ('wings-dragon', 'Majestic Dragon Wings', 'wings', 'epic', '🐉', true, 5),
    ('wings-angel', 'Luminous Archangel Wings', 'wings', 'epic', '🪽', true, 5),
    ('tail-dragon', 'Blazing Dragon Tail', 'tail', 'epic', '🐲', true, 5),
    ('hat-wizard', 'Archmage Star Hat', 'hat', 'epic', '🧙', true, 5),
    ('glasses-cyber', 'Neon Cyber Visor', 'glasses', 'epic', '🕶️', true, 5),
    ('clothing-royal-cape', 'Velvet Royal Cape', 'clothing', 'epic', '🦸', true, 5),
    ('aura-flame', 'Solar Flare Aura', 'aura', 'epic', '🔥', true, 5),

    -- Legendary Items
    ('eyes-galaxy', 'Cosmic Galaxy Eyes', 'eyes', 'legendary', '🌌', true, 2),
    ('horns-gold', 'Crown of Gold Antlers', 'horns', 'legendary', '🔱', true, 2),
    ('wings-cosmic', 'Nebula Star Wings', 'wings', 'legendary', '✨', true, 2),
    ('tail-phoenix', 'Phoenix Eternal Plume', 'tail', 'legendary', '🦚', true, 2),
    ('hat-crown', 'Apex Sovereign Crown', 'hat', 'legendary', '👑', true, 2),
    ('aura-stars', 'Celestial Supernova Orbit', 'aura', 'legendary', '⭐', true, 2),
    ('acc-relic', 'Heart of the Ancient Dragon', 'accessory', 'legendary', '🔮', true, 2)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    rarity = EXCLUDED.rarity,
    icon_url = EXCLUDED.icon_url,
    in_box_pool = EXCLUDED.in_box_pool,
    drop_weight = EXCLUDED.drop_weight;
