import { Linking, Platform } from 'react-native';
import SafariView from 'react-native-safari-view';

export class WebBrowserService {

  static openBrowserAsync = (url) => {
    if (Platform.OS === 'ios') {
      return ServiceAssistants.openInAppUrl(url).catch(() => ServiceAssistants.openUrl(url));
    } else {
      return ServiceAssistants.openUrl(url);
    }
  };
}

const ServiceAssistants = {
  openInAppUrl: (url) => {
    return SafariView
      .isAvailable()
      .then(() => SafariView.show({ url }));
  },

  openUrl: (url) => {
    return Linking.openURL(url);
  }
}
