import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Amplify from '@aws-amplify/core';
import { AppModule } from './app/app.module';
import { environment, Config } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

Amplify.configure({
  Auth: {
    identityPoolId: Config.IDENTITY_POOL_ID,
    region: Config.REGION,
    userPoolId: Config.USER_POOL_ID,
    userPoolWebClientId: Config.CLIENT_ID
  }
});
