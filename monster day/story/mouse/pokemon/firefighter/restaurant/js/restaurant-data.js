/**
 * Restaurant Lesson Data: Menu, Dialogues, Secret Orders, Listening Rounds, Roles
 * Sourced directly from "I'd Like... Restaurant Role Play" ESL Curriculum
 */

window.RESTAURANT_DATA = {
  // 9 Core Menu Items
  menu: [
    // FOOD
    {
      id: 'pizza',
      category: 'food',
      name: 'Pizza',
      icon: '🍕',
      price: '£4.50',
      description: 'Hot cheesy tomato pizza with crispy crust!',
      audio: 'I would like some pizza, please.'
    },
    {
      id: 'salad',
      category: 'food',
      name: 'Salad',
      icon: '🥗',
      price: '£3.00',
      description: 'Fresh crisp green salad with tomatoes and cucumbers.',
      audio: 'I would like some salad, please.'
    },
    {
      id: 'sandwich',
      category: 'food',
      name: 'Sandwich',
      icon: '🥪',
      price: '£3.50',
      description: 'Tasty cheese and ham sandwich on fresh bread.',
      audio: 'I would like some sandwich, please.'
    },
    {
      id: 'pancakes',
      category: 'food',
      name: 'Pancakes',
      icon: '🥞',
      price: '£4.00',
      description: 'Fluffy golden pancakes with sweet syrup!',
      audio: 'I would like some pancakes, please.'
    },
    {
      id: 'pasta',
      category: 'food',
      name: 'Pasta',
      icon: '🍝',
      price: '£4.80',
      description: 'Delicious Italian pasta with warm tomato sauce.',
      audio: 'I would like some pasta, please.'
    },
    {
      id: 'soup',
      category: 'food',
      name: 'Soup',
      icon: '🍲',
      price: '£3.20',
      description: 'Steaming hot vegetable soup in a cozy bowl.',
      audio: 'I would like some soup, please.'
    },

    // DRINKS
    {
      id: 'water',
      category: 'drink',
      name: 'Water',
      icon: '💧',
      price: '£1.00',
      description: 'Fresh, cold sparkling spring water.',
      audio: 'I would like some water, please.'
    },
    {
      id: 'milkshake',
      category: 'drink',
      name: 'Milkshake',
      icon: '🥛',
      price: '£2.50',
      description: 'Creamy strawberry and chocolate milkshake with a straw!',
      audio: 'I would like some milkshake, please.'
    },
    {
      id: 'juice',
      category: 'drink',
      name: 'Juice',
      icon: '🧃',
      price: '£1.80',
      description: 'Sweet and refreshing orange juice box.',
      audio: 'I would like some juice, please.'
    }
  ],

  // 10 Lesson Stages
  stages: [
    { num: 1, id: 'enter', title: '1. Enter Restaurant', time: '4 min', icon: '🍽️' },
    { num: 2, id: 'menu', title: '2. Explore Menu', time: '4 min', icon: '📋' },
    { num: 3, id: 'learn', title: '3. Learn "I\'d Like..."', time: '4 min', icon: '🗣️' },
    { num: 4, id: 'order', title: '4. Ordering Practice', time: '4 min', icon: '🎮' },
    { num: 5, id: 'listen', title: '5. Listen & Remember', time: '4 min', icon: '🧠' },
    { num: 6, id: 'roles', title: '6. Learn the Roles', time: '3 min', icon: '👩‍🍳' },
    { num: 7, id: 'roleplay1', title: '7. First Role-Play', time: '7 min', icon: '🎭' },
    { num: 8, id: 'secret', title: '8. Secret Order', time: '4 min', icon: '🎲' },
    { num: 9, id: 'switch', title: '9. Switch Roles', time: '3 min', icon: '🔄' },
    { num: 10, id: 'final', title: '10. Final Role-Play', time: '3 min', icon: '🏆' }
  ],

  // Dialogue Turns for Complete Role-Play
  dialogueTurns: [
    {
      speaker: 'waiter',
      name: 'WAITER',
      avatar: '🧑‍🍳',
      text: 'Hello! Welcome to our restaurant.',
      prompt: 'Greeting'
    },
    {
      speaker: 'customer',
      name: 'CUSTOMER',
      avatar: '🧒',
      text: 'Hello!',
      prompt: 'Greeting'
    },
    {
      speaker: 'waiter',
      name: 'WAITER',
      avatar: '🧑‍🍳',
      text: 'What would you like?',
      prompt: 'Asking for food'
    },
    {
      speaker: 'customer',
      name: 'CUSTOMER',
      avatar: '🧒',
      text: "I'd like some pizza, please.",
      prompt: 'Ordering food'
    },
    {
      speaker: 'waiter',
      name: 'WAITER',
      avatar: '🧑‍🍳',
      text: 'Anything to drink?',
      prompt: 'Asking for drink'
    },
    {
      speaker: 'customer',
      name: 'CUSTOMER',
      avatar: '🧒',
      text: "I'd like some water, please.",
      prompt: 'Ordering drink'
    },
    {
      speaker: 'waiter',
      name: 'WAITER',
      avatar: '🧑‍🍳',
      text: 'Here you are.',
      prompt: 'Serving food and drink'
    },
    {
      speaker: 'customer',
      name: 'CUSTOMER',
      avatar: '🧒',
      text: 'Thank you!',
      prompt: 'Polite thanks'
    },
    {
      speaker: 'waiter',
      name: 'WAITER',
      avatar: '🧑‍🍳',
      text: "You're welcome!",
      prompt: 'Polite reply'
    }
  ],

  // Secret Customer Order Cards (Food + Drink Pairs)
  secretOrders: [
    { id: 'so1', food: 'pizza', drink: 'water', label: 'Pizza & Water' },
    { id: 'so2', food: 'sandwich', drink: 'milkshake', label: 'Sandwich & Milkshake' },
    { id: 'so3', food: 'pancakes', drink: 'juice', label: 'Pancakes & Juice' },
    { id: 'so4', food: 'pasta', drink: 'water', label: 'Pasta & Water' },
    { id: 'so5', food: 'soup', drink: 'milkshake', label: 'Soup & Milkshake' },
    { id: 'so6', food: 'salad', drink: 'juice', label: 'Salad & Juice' },
    { id: 'so7', food: 'pizza', drink: 'juice', label: 'Pizza & Juice' },
    { id: 'so8', food: 'pasta', drink: 'milkshake', label: 'Pasta & Milkshake' }
  ],

  // Listening Challenge Rounds
  listeningRounds: [
    {
      id: 'lr1',
      customerText: "Hello! I'd like some pizza and some water, please.",
      correctFood: 'pizza',
      correctDrink: 'water',
      question: "What did the customer order?"
    },
    {
      id: 'lr2',
      customerText: "Hello! I'd like some soup and some juice, please.",
      correctFood: 'soup',
      correctDrink: 'juice',
      question: "What did the customer order?"
    },
    {
      id: 'lr3',
      customerText: "Hello! I'd like some pancakes and some milkshake, please.",
      correctFood: 'pancakes',
      correctDrink: 'milkshake',
      question: "What did the customer order?"
    },
    {
      id: 'lr4',
      customerText: "Hello! I'd like some salad and some water, please.",
      correctFood: 'salad',
      correctDrink: 'water',
      question: "What did the customer order?"
    }
  ],

  // Checklists for 5-Star Restaurant Star Award
  starChecklist: {
    customer: [
      { text: 'Say "Hello!"', checked: true },
      { text: 'Say "I\'d like some [food]..."', checked: true },
      { text: 'Say "I\'d like some [drink]..."', checked: true },
      { text: 'Say "Please"', checked: true },
      { text: 'Say "Thank you!"', checked: true }
    ],
    waiter: [
      { text: 'Say "Hello! Welcome to our restaurant."', checked: true },
      { text: 'Ask "What would you like?"', checked: true },
      { text: 'Ask "Anything to drink?"', checked: true },
      { text: 'Say "Here you are."', checked: true },
      { text: 'Say "You\'re welcome!"', checked: true }
    ]
  }
};
