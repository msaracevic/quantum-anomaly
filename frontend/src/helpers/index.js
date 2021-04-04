export function friendlyUrl(arg) {
  return arg.replace(/ /g, '-').toLowerCase();
}

export function lowercaseComparison(arg) {
  return arg.replace(/ /g, '-').toLowerCase();
}

export function seo(data = {}) {
  const keywords = data.keywords || [];

  data.title = data.title || 'Quantum Anomaly';
  data.metaDescription = data.metaDescription || 'Quantum Anomaly websites contains useful information and resources about online games such as EVE Online, Elite Dangerous, X4 Foundations, X4 Split Vendetta';
  data.keywords = ['Quantum Anomaly', 'X4', 'Split Vendetta', 'Cradle of Humanity', 'EVE Online', 'Epic Arcs'].concat(keywords).join(',');

  if (data.title.indexOf('Quantum Anomaly') === -1) data.title += ' - Quantum Anomaly';

  document.title = data.title;
  document.querySelector('meta[name="description"]').setAttribute('content', data.metaDescription);
  document.querySelector('meta[name="keywords"]').setAttribute('content', data.keywords.replace(/,/g, ', '));
}

export function updateCanonical() {
  const link = !!document.querySelector('link[rel=\'canonical\']') ? document.querySelector('link[rel=\'canonical\']') : document.createElement('link');
  link.setAttribute('rel', 'canonical');
  link.setAttribute('href', window.location.protocol + '//' + window.location.host + window.location.pathname);
  document.head.appendChild(link);
}

export function dynamicSort(property, caseInsensitive) {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property  = property.substr(1);
  }
  return (a, b) => {
    let result;
    if (caseInsensitive) {
      result = (a[property].toLocaleLowerCase() < b[property].toLocaleLowerCase()) ? -1 : (a[property].toLocaleLowerCase() > b[property].toLocaleLowerCase()) ? 1 : 0;
    } else {
      result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    }
    return result * sortOrder;
  };
}

export function dynamicSortMultiple() {
  const props = arguments;
  return (obj1, obj2) => {
    let index,
      result = 0;
    for (index = 0; result === 0 && index < props.length; index++) {
      result = dynamicSort(props[index])(obj1, obj2);
    }
    return result;
  };
}
