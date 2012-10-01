<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" media-type="text/csv" encoding="UTF-8" indent="yes"/>

<xsl:param name="docroot" select="'./'" />

<!-- TODO: do not descent into inset param1="TABLETEXCLUDE" -->

<xsl:template match="/article-doc">
{
	"v" : 1,
	"m" : [<xsl:apply-templates select="article/article-body//media"/>],
	"l" : [<xsl:apply-templates select="article/article-body//link"/>]
}
</xsl:template>

<xsl:template name="escapeQuote">
  <xsl:param name="pText" select="."/>

  <xsl:if test="string-length($pText) >0">
   <xsl:value-of select=
    "substring-before(concat($pText, '&quot;'), '&quot;')"/>

   <xsl:if test="contains($pText, '&quot;')">
    <xsl:text>\"</xsl:text>

    <xsl:call-template name="escapeQuote">
      <xsl:with-param name="pText" select=
      "substring-after($pText, '&quot;')"/>
    </xsl:call-template>
   </xsl:if>
  </xsl:if>
</xsl:template>
<!--
Image:
<media alignment="LEFT" reuse-expiration="2013-06-19" reuse-type="restricted" type="ILLUSTRATION">
<image alternate-text="G20sub" height="226" slug="G20sub" src-id="WO-AK166_G20sub_F_20120619182830.jpg" width="571"/>
<alt-image alternate-text="G20sub" height="76" slug="G20sub" src-id="WO-AK166_G20sub_A_20120619182830.jpg" width="76"/>
<alt-image alternate-text="G20sub" height="94" slug="G20sub" src-id="WO-AK166_G20sub_C_20120619182830.jpg" width="167"/>
<alt-image alternate-text="G20sub" height="174" slug="G20sub" src-id="WO-AK166_G20sub_D_20120619182830.jpg" width="262"/>
<alt-image alternate-text="G20sub" height="239" slug="G20sub" src-id="WO-AK166_G20sub_E_20120619182830.jpg" width="359"/>
<alt-image alternate-text="G20sub" height="369" slug="G20sub" src-id="WO-AK166_G20sub_G_20120619182830.jpg" width="553"/>
<media-credit>DPA/Zuma Press</media-credit>
<media-caption>
At the table in Los Cabos, from left, French President François Hollande, German Chancellor Angela Merkel, Italian Premier Mario Monti and Spain's Premier Mariano Rajoy face President Barack Obama, the EU's Herman Van Rompuy, wearing glasses; and U.K. Prime Minister David Cameron.
</media-caption>
</media>

Slideshow:
<media alignment="LEFT" height="174" reuse-type="restricted" thumbnail-src="OB-TK587_0618g2_D_20120618150307.jpg" type="FLASH" width="262">
<image alternate-text="SB10001424052702303703004577474780484830346" slug="slideshow" src-id="SLIDESHOW08"/>
<media-credit>European Pressphoto Agency</media-credit>
<media-caption>
U.S. President Barack Obama, right, and Russian President Vladimir Putin, left, met Monday for the first time since Mr. Putin returned to the presidency, in Los Cabos, Mexico, ahead of the G-20 summit.
</media-caption>
</media>

- References SB10001424052702303703004577474780484830346.xml

Video:
<media type="VIDEO">
<image slug="video-00C1A2ED-7109-4711-B6E9-C3080FBE5FB7" src-id="00C1A2ED-7109-4711-B6E9-C3080FBE5FB7"/>
<media-caption>
Beyond immediate fixes to the Eurozone crisis, leaders at the G-20 summit are also tackling more long-term solutions to global food security. Grupo Bimbo CEO Daniel Servitje discusses some of the strategies.
</media-caption>
</media>

- References 00C1A2ED-7109-4711-B6E9-C3080FBE5FB7.jpg

Interactive graphics:
<media alignment="LEFT" height="174" reuse-type="restricted" thumbnail-src="OB-UE164_081412_D_20120814134444.jpg" type="FLASH" width="262">
<image slug="interactive" src-id="POD_081412"/>
<media-credit>REUTERS</media-credit>
</media>

- References info-POD_081412-settings.js

External Video:

<media type="VIDEO-EXTERNAL"><image alternate-text="html5=true" src-id="http://www.youtube.com/embed/aVLAD7-AjgM"/></media>


-->
<xsl:template match="media">
	{
		<xsl:choose>
			<xsl:when test="/article-doc[@type = 'Infogrfx Slide Show'] and following-sibling::p">
				"caption": "<xsl:call-template name="escapeQuote"><xsl:with-param name="pText" select="following-sibling::p" /></xsl:call-template>",</xsl:when>
			<xsl:when test="media-caption">
				"caption": "<xsl:call-template name="escapeQuote"><xsl:with-param name="pText" select="media-caption"/></xsl:call-template>",</xsl:when>
		</xsl:choose>
		<xsl:if test="media-credit">
				"credit": "<xsl:call-template name="escapeQuote"><xsl:with-param name="pText" select="media-credit"/></xsl:call-template>",</xsl:if>		
		<xsl:choose>
			<xsl:when test="@type = 'VIDEO'">
				"type": "video",
				"url": "<xsl:value-of select="image/@src-id"/>.jpg",
				"link": "<xsl:value-of select="image/@src-id"/>"
			</xsl:when>
			<xsl:when test="@type = 'VIDEO-EXTERNAL' and contains(image/@alternate-text, 'html5=true')">
				"type": "video",
				"link": "<xsl:value-of select="image/@src-id"/>"
			</xsl:when>
			<xsl:when test="image[@slug = 'slideshow']">
				"type": "slideshow",
				"url": "<xsl:value-of select="@thumbnail-src"/>",
				"link": "<xsl:value-of select="concat($docroot, image/@alternate-text, '.xml')"/>",
				"title": "<xsl:value-of select="document(concat($docroot, image/@alternate-text, '.xml'))/article-doc/article/article-body/headline/main-hed"/>",
				"media": [<xsl:apply-templates select="document(concat($docroot, image/@alternate-text, '.xml'))/article-doc/article/article-body//media"/>]
			</xsl:when>
			<xsl:when test="image[@slug = 'interactive']">
				"type": "interactive",
				"url": "<xsl:value-of select="@thumbnail-src"/>",
				"link": "info-<xsl:value-of select="image/@src-id"/>-settings.js"
			</xsl:when>
			<xsl:otherwise>
				"type": "image",
				"url": "<xsl:value-of select="image/@src-id"/>"
			</xsl:otherwise>
		</xsl:choose>
	}<xsl:if test="following::media">,</xsl:if>
</xsl:template>

<!--
PDF:
<article>
    <article-header>
        <nameloc id="i1">
            <nmlist nametype="ENTITY">http://online.wsj.com/public/resources/documents/CFOSIGNALS.pdf</nmlist>
        </nameloc>
    </article-header>
    <article-body>
        <p>Deloitte's latest <link icon="pdf" linkend="i1" type="EXTERNAL">report</link>(PDF).</p>
-->

<xsl:template match="link[@icon = 'pdf' or @type = 'ARTICLE']">
	<xsl:variable name="id" select="@linkend"/>
	{
		"text": "<xsl:call-template name="escapeQuote"><xsl:with-param name="pText" select="normalize-space(.)"/></xsl:call-template>",
		"type": "<xsl:value-of select="@type"/>",
		"icon": "<xsl:value-of select="@icon"/>",
		"url": "<xsl:value-of select="/article-doc/article/article-header/nameloc[@id = $id]/nmlist"/>"
	}<xsl:if test="following::link[@icon = 'pdf' or @type = 'ARTICLE']">,</xsl:if>
</xsl:template>
<xsl:template match="link">
</xsl:template>

</xsl:stylesheet>
