# Let us use swf parser in ffdec or write a bitstream reader for MATRIX
import subprocess, json

# We can ask ffdec to convert to xml to see the exact coordinates!
# ffdec -swf2xml
cmd = ["tools/jre/bin/java.exe", "-jar", "tools/ffdec/ffdec.jar", "-swf2xml", "build/fleabag_vs_mutt.swf", "build/fleabag.xml"]
subprocess.run(cmd)
print("Converted SWF to XML!")
