# templates-wsj

This project was an import of the following path on the Dow Jones Subversion server:

	https://svnsb.win.dowjones.net/WSJDMobile/mobileConfig/wsj/3

It was imported on February 1st, 2013 at 8:13AM and then modified to support the new Design Technology environment ('[Environment](https://github.dowjones.net/designtechnology/Environment)').

This hopefully will become the new templates pulled into the QA3.  

And some magic.

	~/dev/build-tools/buildProcessUtility --config ~/dev/build-tools/buildConfigs/app.wsj.dev.build.json --files \
	`git -C ~/dev/universal-app-wsj diff --name-only 255324b HEAD | tr '\n' ,  | sed 's/\(.*\),/\1/'`

## Testing whats news transformations

Test data has been added to `/testData`.  Topic specific test data should exist under sub directories from `/testData`.  Testing transformations should not require extensive knowledge of where gelcap will pull files from.  That said, test files can be stored locally in order to verify transformations work.  Example time:


Take the ITP whats news feed and preformat it
	
	xsltproc --path "testData/whatsnews/" wsj-itp-whatsnews-to-rss2.xml 3_8175.xml > formatted.xml

Take the output from the previous step and generate the Whats_news.jpml file:

	xsltproc --path "testData/whatsnews/" wsj-rss-whatsnews-to-jpml.xml formatted.xml WHATS_NEWS.jpml

An important note to make: The fault article djml for whats news has embedded links for accessing articles.  The transformation assumes these will be DJML filenames and fails if they are links.

## Bootstrapping Deloitte sections

CIO, CFO, and Risk & Compliance all require affinity and article templates to be set, triggered by the Deloitte article types.

	export API=http://pubcrawlhost/api/v1

	curl -X PUT -H "Content-Type: application/json" -d '{"map":[{"box_id":"d1","key":"type","value":"Deloitte Cio Blog"},{"box_id":"d2","key":"type","value":"Deloitte Cio Blog"},{"box_id":"d3","key":"type","value":"Deloitte Cio Blog"},{"box_id":"d4","key":"type","value":"Deloitte Cio Blog"},{"box_id":"d5","key":"type","value":"Deloitte Cio Blog"},{"box_id":"d6","key":"type","value":"Deloitte Cio Blog"}]}' $API/publications/wsj/regions/us/mastheads/SWEET/affinity/CIO/0/SECTION-DELOITTE_template.xml

	curl -X PUT -H "Content-Type: application/json" -d '{"map":[{"box_id":"d1","key":"type","value":"Deloitte Cfo Blog"},{"box_id":"d2","key":"type","value":"Deloitte Cfo Blog"},{"box_id":"d3","key":"type","value":"Deloitte Cfo Blog"},{"box_id":"d4","key":"type","value":"Deloitte Cfo Blog"},{"box_id":"d5","key":"type","value":"Deloitte Cfo Blog"},{"box_id":"d6","key":"type","value":"Deloitte Cfo Blog"}]}' $API/publications/wsj/regions/us/mastheads/SWEET/affinity/CFO/0/SECTION-DELOITTE_template.xml

	curl -X PUT -H "Content-Type: application/json" -d '{"map":[{"box_id":"d1","key":"type","value":"Deloitte Riskandcompliance Blog"},{"box_id":"d2","key":"type","value":"Deloitte Riskandcompliance Blog"},{"box_id":"d3","key":"type","value":"Deloitte Riskandcompliance Blog"},{"box_id":"d4","key":"type","value":"Deloitte Riskandcompliance Blog"},{"box_id":"d5","key":"type","value":"Deloitte Riskandcompliance Blog"},{"box_id":"d6","key":"type","value":"Deloitte Riskandcompliance Blog"}]}' $API/publications/wsj/regions/us/mastheads/SWEET/affinity/RISK_AND_COMPLIANCE/0/SECTION-DELOITTE_template.xml

	curl -X PUT -H "Content-Type: application/json" -d '{"template":"ARTICLE-deloitte_template.xml"}' $API/publications/wsj/regions/us/mastheads/SWEET/layout/articles/type/Deloitte%20Cio%20Blog

	curl -X PUT -H "Content-Type: application/json" -d '{"template":"ARTICLE-deloitte_template.xml"}' $API/publications/wsj/regions/us/mastheads/SWEET/layout/articles/type/Deloitte%20Cfo%20Blog

	curl -X PUT -H "Content-Type: application/json" -d '{"template":"ARTICLE-deloitte_template.xml"}' $API/publications/wsj/regions/us/mastheads/SWEET/layout/articles/type/Deloitte%20Riskandcompliance%20Blog

## Debugging

To debug ads you can display the passed in ads dictionary with this `ejs` and `JPML` pair. Good files to add this to are the `TOP-IMAGE_module.xml` for section fronts and the `ARTICLE-front_module.xml` for articles.

	<style>{
		#m_debug: { background-color:"rgba(232, 0, 0, .3)" },
		#m_debug_page: { content: { $join: ["page = ", =page.number ] }},
		#m_debug_id: { content: { $join: ["lineItemID = ", =ad.lineItemID ] }},
		#m_debug_loaded: { content: { if: =ad.loaded, then: "loaded", else: "not loaded" }},
		#m_debug_type: { content: { $join: ["type = ", =ad.type ] }},
		#m_debug_zone: { content: { $join: ["zone = ", =ad.zone ] }}
	}</style>


	<panel id="m_debug">
		<p><mark id="m_debug_loaded"/></p>
		<p><mark id="m_debug_id"/></p>
		<p><mark id="m_debug_type"/></p>
		<p><mark id="m_debug_page"/></p>
		<p><mark id="m_debug_zone"/></p>
	</panel>

## New Debug Blocks

	<style>{
		#m_debug: { background-color:"rgba(232, 0, 0, .3)" },
		#m_debug_page: { content: { $join: ["page = ", =page.number ] }},
		#m_debug_Skyscraper_type: { content: { $join: ["Skyscraper type = ", =ad.cache.Skyscraper.type ] }},
		#m_debug_Skyscraper_id: { content: { $join: ["lineItemID = ", =ad.cache.Skyscraper.lineItemID ] }},
		#m_debug_Skyscraper_loaded: { content: { if: =ad.cache.Skyscraper.loaded, then: "loaded", else: "not loaded" }},
		#m_debug_FullPage_type: { content: { $join: ["FullPage type = ", =ad.cache.FullPage.type ] }},
		#m_debug_FullPage_id: { content: { $join: ["lineItemID = ", =ad.cache.FullPage.lineItemID ] }},
		#m_debug_FullPage_loaded: { content: { if: =ad.cache.FullPage.loaded, then: "loaded", else: "not loaded" }},
		#m_debug_Banner_type: { content: { $join: ["Banner type = ", =ad.cache.Banner.type ] }},
		#m_debug_Banner_id: { content: { $join: ["lineItemID = ", =ad.cache.Banner.lineItemID ] }},
		#m_debug_Banner_loaded: { content: { if: =ad.cache.Banner.loaded, then: "loaded", else: "not loaded" }},
		#m_debug_Cube_type: { content: { $join: ["Cube type = ", =ad.cache.Cube.type ] }},
		#m_debug_Cube_id: { content: { $join: ["lineItemID = ", =ad.cache.Cube.lineItemID ] }},
		#m_debug_Cube_loaded: { content: { if: =ad.cache.Cube.loaded, then: "loaded", else: "not loaded" }}
	}</style>
	<panel id="m_debug">
		<p><mark id="m_debug_page"/></p>
		<p><mark id="m_debug_Skyscraper_type"/></p>
		<p><mark id="m_debug_Skyscraper_id"/></p>
		<p><mark id="m_debug_Skyscraper_loaded"/></p>
		<p><mark id="m_debug_FullPage_type"/></p>
		<p><mark id="m_debug_FullPage_id"/></p>
		<p><mark id="m_debug_FullPage_loaded"/></p>
		<p><mark id="m_debug_Cube_type"/></p>
		<p><mark id="m_debug_Cube_id"/></p>
		<p><mark id="m_debug_Cube_loaded"/></p>
		<p><mark id="m_debug_Banner_type"/></p>
		<p><mark id="m_debug_Banner_id"/></p>
		<p><mark id="m_debug_Banner_loaded"/></p>
	</panel>
