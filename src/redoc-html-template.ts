/**
 * ReDoc theme configuration options
 * @see https://redocly.com/docs/api-reference-docs/configuration/theming/
 */
export interface RedocTheme {
  colors?: {
    primary?: {
      main?: string;
      light?: string;
      dark?: string;
      contrastText?: string;
    };
    secondary?: {
      main?: string;
      light?: string;
      dark?: string;
      contrastText?: string;
    };
    success?: {
      main?: string;
      light?: string;
      dark?: string;
    };
    warning?: {
      main?: string;
      light?: string;
      dark?: string;
    };
    error?: {
      main?: string;
      light?: string;
      dark?: string;
    };
    http?: {
      get?: string;
      post?: string;
      put?: string;
      delete?: string;
      patch?: string;
    };
    responses?: {
      success?: {
        color?: string;
        backgroundColor?: string;
      };
      error?: {
        color?: string;
        backgroundColor?: string;
      };
      redirect?: {
        color?: string;
        backgroundColor?: string;
      };
      info?: {
        color?: string;
        backgroundColor?: string;
      };
    };
    text?: {
      primary?: string;
      secondary?: string;
    };
    border?: {
      dark?: string;
      light?: string;
    };
  };
  typography?: {
    fontSize?: string | number;
    fontFamily?: string;
    smoothing?: string;
    optimizeSpeed?: boolean;
    fontWeight?: string | number;
    headings?: {
      fontFamily?: string;
      fontWeight?: string;
      lineHeight?: string;
    };
    code?: {
      fontSize?: string | number;
      fontFamily?: string;
      fontWeight?: string;
      color?: string;
      backgroundColor?: string;
      wrap?: boolean;
    };
    links?: {
      color?: string;
      visited?: string;
      hover?: string;
    };
  };
  sidebar?: {
    width?: string;
    backgroundColor?: string;
    textColor?: string;
    activeTextColor?: string;
  };
  logo?: {
    maxHeight?: string;
    maxWidth?: string;
    gutter?: string;
  };
  rightPanel?: {
    backgroundColor?: string;
    width?: string;
    textColor?: string;
  };
}

/**
 * ReDoc configuration options
 * @see https://redocly.com/docs/api-reference-docs/configuration/functionality/
 */
export interface RedocOptions {
  /**
   * Hide the download button for the spec
   * @default false
   */
  hideDownloadButton?: boolean;
  /**
   * Hide the hostname in the API definition
   */
  hideHostname?: boolean;
  /**
   * Scroll offset from the top of the page
   */
  scrollYOffset?: number | string | (() => number);
  /**
   * Enable "Try it out" functionality
   */
  tryItOutEnabled?: boolean;
  /**
   * Show path in the middle panel
   */
  pathInMiddlePanel?: boolean;
  /**
   * Show required properties first
   */
  requiredPropsFirst?: boolean;
  /**
   * Only show required properties in samples
   */
  onlyRequiredInSamples?: boolean;
  /**
   * Expand single schema fields by default
   */
  expandSingleSchemaField?: boolean;
  /**
   * Expand default server variables
   */
  expandDefaultServerVariables?: boolean;
  /**
   * Disable search functionality
   */
  disableSearch?: boolean;
  /**
   * Use native scrollbars
   */
  nativeScrollbars?: boolean;
  /**
   * Use simple oneOf model display
   */
  simpleOneOfModel?: boolean;
  /**
   * Sort enum values alphabetically
   */
  sortEnumValuesAlphabetically?: boolean;
  /**
   * Sort operations alphabetically
   */
  sortOperationsAlphabetically?: boolean;
  /**
   * Sort tags alphabetically
   */
  sortTagsAlphabetically?: boolean;
  /**
   * Theme configuration
   */
  theme?: RedocTheme;
  /**
   * Allow configuration options to be passed
   */
  [key: string]: unknown;
}

/**
 * Options for the redoc-express middleware
 */
export interface Ioption {
  /**
   * Title displayed in the browser tab and header
   */
  title: string;
  /**
   * URL to your OpenAPI/Swagger specification file
   */
  specUrl: string;
  /**
   * Security nonce for Content Security Policy compliance
   * @see https://content-security-policy.com/nonce/
   */
  nonce?: string;
  /**
   * ReDoc configuration options
   * @see https://redocly.com/docs/api-reference-docs/configuration/functionality/
   */
  redocOptions?: RedocOptions;
}

const html = `<!DOCTYPE html>
<html>
  <head>
    <title>[[title]]</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet" />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="redoc-container"></div>
    <script nonce='[[nonce]]' src="https://unpkg.com/redoc@^2.5.2/bundles/redoc.standalone.js"> </script>
  </body>
  <script>
    Redoc.init(
      "[[spec-url]]",
      [[options]],
      document.getElementById("redoc-container")
    );
  </script>
</html>`;

/**
 * Generates HTML for rendering ReDoc documentation
 * @param options - Configuration options for ReDoc
 * @param options.title - Title displayed in the browser tab and header
 * @param options.specUrl - URL to your OpenAPI/Swagger specification file
 * @param options.nonce - Security nonce for Content Security Policy compliance
 * @param options.redocOptions - ReDoc configuration options for theming and functionality
 * @returns Complete HTML document as a string
 * @example
 * ```typescript
 * const html = redocHtml({
 *   title: 'My API Documentation',
 *   specUrl: '/docs/swagger.json',
 *   nonce: 'random-nonce-123',
 *   redocOptions: {
 *     theme: { colors: { primary: { main: '#1976d2' } } }
 *   }
 * });
 * ```
 */
function redocHtml(
  options: Ioption = {
    title: 'ReDoc',
    specUrl: 'http://petstore.swagger.io/v2/swagger.json'
  }
): string {
  const { title, specUrl, nonce = '', redocOptions = {} } = options;
  return html
    .replace('[[title]]', title)
    .replace('[[spec-url]]', specUrl)
    .replace('[[nonce]]', nonce)
    .replace('[[options]]', JSON.stringify(redocOptions));
}

export { redocHtml };
export default redocHtml;
