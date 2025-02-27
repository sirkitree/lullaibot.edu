import puppeteer from 'puppeteer';
import axios from 'axios';

class ContentExtractor {
  /**
   * Extract content from a URL
   * @param {string} url - The URL to extract content from
   * @returns {Promise<string>} The extracted content
   */
  async extractContent(url) {
    try {
      // Preprocess URL - add protocol if missing
      let processedUrl = url;
      if (!url.match(/^[a-zA-Z]+:\/\//)) {
        processedUrl = `https://${url}`;
        console.log(`URL preprocessed: ${url} -> ${processedUrl}`);
      }
      
      const isValidUrl = this.isValidUrl(processedUrl);
      if (!isValidUrl) {
        throw new Error('Invalid URL provided');
      }

      // First try with axios for simple pages
      try {
        const axiosResult = await this.extractWithAxios(processedUrl);
        if (axiosResult.content && axiosResult.content.length > 500) {
          return axiosResult; // Return the object with title and content
        }
      } catch (error) {
        console.log('Simple extraction failed, trying with puppeteer:', error.message);
      }

      // If simple extraction fails or returns limited content, use puppeteer
      return await this.extractWithPuppeteer(processedUrl);
    } catch (error) {
      console.error('Content extraction error:', error);
      throw new Error(`Failed to extract content: ${error.message}`);
    }
  }

  /**
   * Extract content from a URL (alias for extractContent)
   * @param {string} url - The URL to extract content from
   * @returns {Promise<Object>} The extracted content with title
   */
  async extract(url) {
    // Preprocess URL before passing to extractContent
    let processedUrl = url;
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      processedUrl = `https://${url}`;
      console.log(`URL preprocessed in extract(): ${url} -> ${processedUrl}`);
    }
    
    const result = await this.extractContent(processedUrl);
    
    // Ensure we always return an object with title and content
    if (typeof result === 'string') {
      console.log('extract() returning string content without title');
      return {
        title: '',
        content: result
      };
    }
    
    console.log(`extract() returning title: "${result.title}" with content length: ${result.content ? result.content.length : 0}`);
    return result;
  }

  /**
   * Check if a URL is valid
   * @param {string} url - The URL to check
   * @returns {boolean} Whether the URL is valid
   */
  isValidUrl(url) {
    try {
      // Add https:// if no protocol is specified
      let urlToCheck = url;
      if (!url.match(/^[a-zA-Z]+:\/\//)) {
        urlToCheck = `https://${url}`;
      }
      new URL(urlToCheck);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extract content using axios (simple HTTP request)
   * @param {string} url - The URL to extract content from
   * @returns {Promise<Object>} Object containing title and content
   */
  async extractWithAxios(url) {
    console.log(`Extracting with Axios from: ${url}`);
    try {
      const response = await axios.get(url);
      const html = response.data;
      
      // Extract title from HTML using multiple methods
      let title = '';
      
      // Method 1: Check <title> tag
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
        console.log(`Axios extracted title from <title> tag: "${title}"`);
      }
      
      // Method 2: Check Open Graph meta tag if title is empty
      if (!title) {
        const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
        if (ogTitleMatch && ogTitleMatch[1]) {
          title = ogTitleMatch[1].trim();
          console.log(`Axios extracted title from og:title: "${title}"`);
        }
      }
      
      // Method 3: Check Twitter card meta tag if title is still empty
      if (!title) {
        const twitterTitleMatch = html.match(/<meta\s+name=["']twitter:title["']\s+content=["'](.*?)["']/i);
        if (twitterTitleMatch && twitterTitleMatch[1]) {
          title = twitterTitleMatch[1].trim();
          console.log(`Axios extracted title from twitter:title: "${title}"`);
        }
      }
      
      // Method 4: Look for the first <h1> tag as a last resort
      if (!title) {
        const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
        if (h1Match && h1Match[1]) {
          title = this.stripHtml(h1Match[1]).trim();
          console.log(`Axios extracted title from h1: "${title}"`);
        }
      }
      
      if (!title) {
        console.log('Axios could not extract any title from HTML');
        
        // Use URL as fallback title
        const urlObj = new URL(url);
        title = urlObj.hostname.replace('www.', '');
        console.log(`Using hostname as fallback title: "${title}"`);
      }
      
      // Clean the title
      title = this.cleanTitle(title);
      console.log(`Final cleaned title: "${title}"`);
      
      // Simple HTML content extraction
      const strippedContent = this.stripHtml(html);
      const cleanedContent = this.cleanContent(strippedContent);
      
      console.log(`Axios extraction complete - title: "${title}", content length: ${cleanedContent.length}`);
      return {
        title,
        content: cleanedContent
      };
    } catch (error) {
      console.error(`Axios extraction error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extract content using puppeteer (for JavaScript-rendered pages)
   * @param {string} url - The URL to extract content from
   * @returns {Promise<string>} The extracted content
   */
  async extractWithPuppeteer(url) {
    console.log(`Extracting with Puppeteer from: ${url}`);
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Set a timeout for navigation
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Extract the page title
      let pageTitle = await page.title();
      console.log(`Puppeteer extracted title from page.title(): "${pageTitle}"`);
      
      // If no title was found, try alternative methods
      if (!pageTitle) {
        // Try to extract Open Graph title
        pageTitle = await page.evaluate(() => {
          const ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle) return ogTitle.getAttribute('content');
          
          // Try twitter title
          const twitterTitle = document.querySelector('meta[name="twitter:title"]');
          if (twitterTitle) return twitterTitle.getAttribute('content');
          
          // Try h1
          const h1 = document.querySelector('h1');
          if (h1) return h1.innerText;
          
          return '';
        });
        
        if (pageTitle) {
          console.log(`Puppeteer extracted alternative title: "${pageTitle}"`);
        }
      }
      
      // If still no title, use domain name
      if (!pageTitle) {
        const urlObj = new URL(url);
        pageTitle = urlObj.hostname.replace('www.', '');
        console.log(`Using hostname as fallback title: "${pageTitle}"`);
      }

      // Clean the title
      pageTitle = this.cleanTitle(pageTitle);
      console.log(`Final cleaned title: "${pageTitle}"`);

      // Extract the main content
      const content = await page.evaluate(() => {
        // Try to find main content containers
        const contentSelectors = [
          'article', 'main', '.content', '#content',
          '.post', '.article', '.blog-post',
          '[role="main"]'
        ];
        
        for (const selector of contentSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            return element.innerText;
          }
        }
        
        // Fallback to body if no content containers are found
        return document.body.innerText;
      });

      const cleanedContent = this.cleanContent(content);
      console.log(`Puppeteer extraction complete - title: "${pageTitle}", content length: ${cleanedContent.length}`);
      
      return {
        title: pageTitle,
        content: cleanedContent
      };
    } catch (error) {
      console.error(`Puppeteer extraction error: ${error.message}`);
      throw error;
    } finally {
      await browser.close();
    }
  }

  /**
   * Strip HTML tags from a string
   * @param {string} html - The HTML string to strip
   * @returns {string} The text content without HTML tags
   */
  stripHtml(html) {
    // Remove scripts and style elements
    let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    
    // Remove HTML tags
    text = text.replace(/<\/?[^>]+(>|$)/g, ' ');
    
    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    
    return text;
  }

  /**
   * Clean extracted content
   * @param {string} content - The content to clean
   * @returns {string} The cleaned content
   */
  cleanContent(content) {
    if (!content) return '';
    
    // Normalize whitespace
    let cleaned = content.replace(/\s+/g, ' ');
    
    // Remove common navigation text
    const boilerplateTexts = [
      'cookie', 'privacy policy', 'terms of service',
      'sign up', 'log in', 'subscribe', 'menu', 'navigation'
    ];
    
    // Remove very short lines that might be navigation
    const lines = cleaned.split('\n').filter(line => {
      const trimmed = line.trim();
      if (trimmed.length < 20) {
        // Check if it contains boilerplate text
        return !boilerplateTexts.some(text => 
          trimmed.toLowerCase().includes(text)
        );
      }
      return true;
    });
    
    cleaned = lines.join('\n');
    
    return cleaned.trim();
  }

  /**
   * Clean a title string to remove unwanted characters
   * @param {string} title - The title to clean
   * @returns {string} The cleaned title
   */
  cleanTitle(title) {
    if (!title) return '';
    
    // Replace backslashes with a dash
    let cleaned = title.replace(/\\/g, ' - ');
    
    // Replace multiple spaces with a single space
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    // Trim whitespace
    return cleaned.trim();
  }
}

export default new ContentExtractor(); 