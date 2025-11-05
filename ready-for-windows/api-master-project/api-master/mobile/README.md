# API Master Mobile Application

Mobile application built with React Native for iOS and Android.

## Development Setup

### Prerequisites
- Node.js 18+
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
# Install dependencies
npm install

# iOS specific (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Features
- Cross-platform (iOS & Android)
- Secure credential storage with Keychain
- Push notifications
- Biometric authentication
- Offline mode
- Real-time updates

## Building for Production

### iOS
```bash
cd ios
xcodebuild -workspace ApiMaster.xcworkspace -scheme ApiMaster -configuration Release
```

### Android
```bash
cd android
./gradlew assembleRelease
```

## App Store Distribution
- iOS: Submit to Apple App Store via App Store Connect
- Android: Submit to Google Play Console

## Store Requirements
See `/store-requirements/` folder for:
- App icons (all sizes)
- Screenshots (all devices)
- Store descriptions
- Privacy policy
- Terms of service
