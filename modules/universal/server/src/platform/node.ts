export {Parse5DomAdapter} from 'angular2/src/platform/server/parse5_adapter';

import {Type, isPresent, CONST_EXPR} from 'angular2/src/facade/lang';
import {Promise} from 'angular2/src/facade/promise'

import {Testability} from 'angular2/src/core/testability/testability';
import {BrowserDetails} from 'angular2/src/animate/browser_details';
import {AnimationBuilder} from 'angular2/src/animate/animation_builder';

import {
  // DOCUMENT,
  BROWSER_APP_COMMON_PROVIDERS,
  ELEMENT_PROBE_BINDINGS,
  ELEMENT_PROBE_PROVIDERS,
} from 'angular2/src/platform/browser_common';
import {XHRImpl} from 'angular2/src/platform/browser/xhr_impl';
import {Parse5DomAdapter} from 'angular2/src/platform/server/parse5_adapter';
Parse5DomAdapter.makeCurrent();
import {DOM} from 'angular2/src/platform/dom/dom_adapter';
// import {DomRenderer} from 'angular2/src/platform/dom/dom_renderer';

import {COMPILER_PROVIDERS, XHR} from 'angular2/compiler';
import {ReflectionCapabilities} from 'angular2/src/core/reflection/reflection_capabilities';

import {DirectiveResolver} from 'angular2/src/core/linker/directive_resolver';
import {APP_COMPONENT} from 'angular2/src/core/application_tokens';

import {
  provide,
  Provider,
  PLATFORM_INITIALIZER,
  PLATFORM_COMMON_PROVIDERS,
  PLATFORM_DIRECTIVES,
  PLATFORM_PIPES,
  APPLICATION_COMMON_PROVIDERS,
  ComponentRef,
  platform,
  reflector,
  ExceptionHandler,
  Renderer
} from 'angular2/core';
import {COMMON_DIRECTIVES, COMMON_PIPES, FORM_PROVIDERS} from 'angular2/common';

import {EventManager, EVENT_MANAGER_PLUGINS} from 'angular2/src/platform/dom/events/event_manager';
import {DomEventsPlugin} from 'angular2/src/platform/dom/events/dom_events';
import {KeyEventsPlugin} from 'angular2/src/platform/dom/events/key_events';
import {HammerGesturesPlugin} from 'angular2/src/platform/dom/events/hammer_gestures';

import {DomSharedStylesHost} from 'angular2/src/platform/dom/shared_styles_host';
import {SharedStylesHost} from 'angular2/src/platform/dom/shared_styles_host';



import {DOCUMENT, DomRenderer, ServerDomRenderer_} from '../render/server_dom_renderer';

export function initNodeAdapter() {
  Parse5DomAdapter.makeCurrent();
  console.log('#### node Init ####');

}

export const NODE_PROVIDERS: Array<any> = CONST_EXPR([
  ...PLATFORM_COMMON_PROVIDERS,
  new Provider(PLATFORM_INITIALIZER, {useValue: initNodeAdapter, multi: true}),
]);

function _exceptionHandler(): ExceptionHandler {
  return new ExceptionHandler(DOM, false);
}

export const NODE_APP_COMMON_PROVIDERS: Array<any> = CONST_EXPR([
  ...APPLICATION_COMMON_PROVIDERS,
  ...FORM_PROVIDERS,
  new Provider(PLATFORM_PIPES, {useValue: COMMON_PIPES, multi: true}),
  new Provider(PLATFORM_DIRECTIVES, {useValue: COMMON_DIRECTIVES, multi: true}),
  new Provider(ExceptionHandler, {useFactory: _exceptionHandler, deps: []}),
  new Provider(DOCUMENT, {
    useFactory: () => {
      // TODO(gdi2290): don't use app
      let selector = 'app';
      let serverDocument = DOM.createHtmlDocument();
      let el = DOM.createElement(selector, serverDocument);
      DOM.appendChild(serverDocument.body, el);
      return serverDocument;
    },
    deps: []
  }),
  new Provider(EVENT_MANAGER_PLUGINS, {useClass: DomEventsPlugin, multi: true}),
  new Provider(EVENT_MANAGER_PLUGINS, {useClass: KeyEventsPlugin, multi: true}),
  new Provider(EVENT_MANAGER_PLUGINS, {useClass: HammerGesturesPlugin, multi: true}),
  new Provider(DomRenderer, {useClass: ServerDomRenderer_}),
  new Provider(Renderer, {useExisting: DomRenderer}),
  new Provider(SharedStylesHost, {useExisting: DomSharedStylesHost}),
  DomSharedStylesHost,
  Testability,
  BrowserDetails,
  AnimationBuilder,
  EventManager
]);

/**
 * An array of providers that should be passed into `application()` when bootstrapping a component.
 */
export const NODE_APP_PROVIDERS: Array<any> = CONST_EXPR([
  ...NODE_APP_COMMON_PROVIDERS,
  ...COMPILER_PROVIDERS,
  // TODO(gdi2290): make http node version
  new Provider(XHR, {useClass: XHRImpl}),
]);

/**
 *
 */
export function bootstrap(appComponentType: Type, customProviders?: Array<any>): Promise<ComponentRef> {
  reflector.reflectionCapabilities = new ReflectionCapabilities();

  let appProviders = isPresent(customProviders) ? [
      ...NODE_APP_PROVIDERS,
      ...customProviders
    ] : NODE_APP_PROVIDERS;

  return platform(NODE_PROVIDERS).application(appProviders).bootstrap(appComponentType);
}
