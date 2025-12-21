import JSZip from 'jszip';
import { format } from 'date-fns';

/**
 * Export Service - Handle all export formats
 */
class ExportService {
  /**
   * Download file
   */
  static downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export as JSON
   */
  static exportAsJSON(sessionData, filename) {
    const json = JSON.stringify(sessionData, null, 2);
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const finalFilename = filename || `session_${timestamp}.json`;
    this.downloadFile(json, finalFilename, 'application/json');
  }

  /**
   * Export as Markdown
   */
  static exportAsMarkdown(prdContent, filename) {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const finalFilename = filename || `PRD_${timestamp}.md`;
    this.downloadFile(prdContent, finalFilename, 'text/markdown');
  }

  /**
   * Export Prototype as Single HTML
   */
  static exportAsSingleHTML(htmlContent, filename) {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const finalFilename = filename || `prototype_${timestamp}.html`;
    this.downloadFile(htmlContent, finalFilename, 'text/html');
  }

  /**
   * Export as ZIP (HTML + CSS + JS + Assets)
   */
  static async exportAsZIP(sessionData, filename) {
    try {
      const zip = new JSZip();

      // Add index.html
      zip.file('index.html', sessionData.prototypeData?.html || '');

      // Add styles if separated
      if (sessionData.prototypeData?.css) {
        zip.file('styles.css', sessionData.prototypeData.css);
      }

      // Add scripts if separated
      if (sessionData.prototypeData?.js) {
        zip.file('script.js', sessionData.prototypeData.js);
      }

      // Add PRD
      if (sessionData.prdData?.content) {
        zip.file('README.md', sessionData.prdData.content);
      }

      // Add metadata
      const metadata = {
        generatedAt: new Date().toISOString(),
        mode: sessionData.mode,
        topic: sessionData.topic,
        version: '1.0',
      };
      zip.file('metadata.json', JSON.stringify(metadata, null, 2));

      // Generate ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      link.href = url;
      link.download = filename || `prototype_${timestamp}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error exporting as ZIP:', error);
      throw error;
    }
  }

  /**
   * Copy text to clipboard
   */
  static copyToClipboard(text) {
    return navigator.clipboard.writeText(text)
      .then(() => {
        console.log('✅ Copied to clipboard');
        return true;
      })
      .catch((error) => {
        console.error('❌ Copy failed:', error);
        return false;
      });
  }
}

export default ExportService;
