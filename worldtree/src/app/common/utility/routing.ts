import { UrlMatcher, UrlSegment } from '@angular/router';

export function optionalRoute(path: string): UrlMatcher {
  const parts = path.split('/');

  return (urlSegments: UrlSegment[]) => {
    const posParams: { [name: string]: UrlSegment } = {};
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].startsWith(':') && parts[i].endsWith('?')) {
        if (urlSegments[i]) {
          posParams[parts[i].substring(1, parts[i].length - 1)] =
            urlSegments[i];
        }
      } else if (parts[i].startsWith(':')) {
        if (!urlSegments[i]) {
          return null;
        }
        posParams[parts[i].substring(1, parts[i].length)] = urlSegments[i];
      } else {
        if (!urlSegments[i] || urlSegments[i].path !== parts[i]) {
          return null;
        }
      }
    }
    return {
      consumed: urlSegments,
      posParams,
    };
  };
}

export function matchFirst(...matchers: UrlMatcher[]): UrlMatcher {
  return (...args) => {
    for (const matcher of matchers) {
      const result = matcher(...args);
      if (result != null) {
        return result;
      }
    }
    return null;
  };
}
