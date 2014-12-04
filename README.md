wsj-ipad-app- This is dev to be published to QA3..
========

This project was an import of the following path on the Dow Jones Subversion server:

https://svnsb.win.dowjones.net/WSJDMobile/mobileConfig/wsj/3

It was imported on February 1st, 2013 at 8:13AM and then modified to support the new Design Technology environment ('[Environment](https://github.dowjones.net/designtechnology/Environment)').

This hopefully will become the new templates pulled into the QA3.  


And some magic.

```
~/dev/build-tools/buildProcessUtility --config ~/dev/build-tools/buildConfigs/app.wsj.dev.build.json --files \
`git -C ~/dev/universal-app-wsj diff --name-only 255324b HEAD | tr '\n' ,  | sed 's/\(.*\),/\1/'`
```


##Testing whats news transformations
Test data has been added to /testData.  Topic specific test data should exist under sub directories from /testData.  Testing transformations should not require extensive knowledge of where gelcap will pull files from.  That said, test files can be stored locally in order to verify transformations work.  Example time:


Take the ITP whats news feed and preformat it
```
xsltproc --path "testData/whatsnews/" wsj-itp-whatsnews-to-rss2.xml 3_8175.xml > formatted.xml
```

Take the output from the previous step and generate the Whats_news.jpml file:
```
xsltproc --path "testData/whatsnews/" wsj-rss-whatsnews-to-jpml.xml formatted.xml WHATS_NEWS.jpml
```

An important note to make: The fault article djml for whats news has embedded links for accessing articles.  The transformation assumes these will be DJML filenames and fails if they are links.
test
