templates-wsj
============

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

##Bootstrapping Deloitte sections

CIO, CFO, and Risk & Compliance all require affinity and article templates to be set, triggered by the Deloitte article types.

```
export API=http://pubcrawlhost/api/v1

curl -X PUT -H "Content-Type: application/json" -d '{"map":[{"box_id":"d1","key":"type","value":"Deloitte Cio Blog"},{"box_id":"d2","key":"type","value":"Deloitte Cio Blog"},{"box_id":"d3","key":"type","value":"Deloitte Cio Blog"},{"box_id":"d4","key":"type","value":"Deloitte Cio Blog"},{"box_id":"d5","key":"type","value":"Deloitte Cio Blog"},{"box_id":"d6","key":"type","value":"Deloitte Cio Blog"}]}' $API/publications/wsj/regions/us/mastheads/SWEET/affinity/CIO/0/SECTION-DELOITTE_template.xml

curl -X PUT -H "Content-Type: application/json" -d '{"map":[{"box_id":"d1","key":"type","value":"Deloitte Cfo Blog"},{"box_id":"d2","key":"type","value":"Deloitte Cfo Blog"},{"box_id":"d3","key":"type","value":"Deloitte Cfo Blog"},{"box_id":"d4","key":"type","value":"Deloitte Cfo Blog"},{"box_id":"d5","key":"type","value":"Deloitte Cfo Blog"},{"box_id":"d6","key":"type","value":"Deloitte Cfo Blog"}]}' $API/publications/wsj/regions/us/mastheads/SWEET/affinity/CFO/0/SECTION-DELOITTE_template.xml

curl -X PUT -H "Content-Type: application/json" -d '{"map":[{"box_id":"d1","key":"type","value":"Deloitte Riskandcompliance Blog"},{"box_id":"d2","key":"type","value":"Deloitte Riskandcompliance Blog"},{"box_id":"d3","key":"type","value":"Deloitte Riskandcompliance Blog"},{"box_id":"d4","key":"type","value":"Deloitte Riskandcompliance Blog"},{"box_id":"d5","key":"type","value":"Deloitte Riskandcompliance Blog"},{"box_id":"d6","key":"type","value":"Deloitte Riskandcompliance Blog"}]}' $API/publications/wsj/regions/us/mastheads/SWEET/affinity/RISK_AND_COMPLIANCE/0/SECTION-DELOITTE_template.xml

curl -X PUT -H "Content-Type: application/json" -d '{"template":"ARTICLE-deloitte_template.xml"}' $API/publications/wsj/regions/us/mastheads/SWEET/layout/articles/type/Deloitte%20Cio%20Blog

curl -X PUT -H "Content-Type: application/json" -d '{"template":"ARTICLE-deloitte_template.xml"}' $API/publications/wsj/regions/us/mastheads/SWEET/layout/articles/type/Deloitte%20Cfo%20Blog

curl -X PUT -H "Content-Type: application/json" -d '{"template":"ARTICLE-deloitte_template.xml"}' $API/publications/wsj/regions/us/mastheads/SWEET/layout/articles/type/Deloitte%20Riskandcompliance%20Blog
```




