wsj-ipad-app- This is dev to be published to QA3..
========

This project was an import of the following path on the Dow Jones Subversion server:

https://svnsb.win.dowjones.net/WSJDMobile/mobileConfig/wsj/3

It was imported on February 1st, 2013 at 8:13AM and then modified to support the new Design Technology environment ('[Environment](https://github.dowjones.net/designtechnology/Environment)').

This hopefully will become the new templates pulled into the QA3.  


And some magic

```
~/dev/build-tools/buildProcessUtility --config ~/dev/build-tools/buildConfigs/app.wsj.dev.build.json --files \
`git -C ~/dev/universal-app-wsj diff --name-only 255324b HEAD | tr '\n' ,  | sed 's/\(.*\),/\1/'`
```
