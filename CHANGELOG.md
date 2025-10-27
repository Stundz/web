# Changelog

## [5.3.0](https://github.com/Stundz/web/compare/v5.2.0...v5.3.0) (2025-10-27)


### Features

* **auth:** Implementented authentication ([5b46070](https://github.com/Stundz/web/commit/5b460707d8f5b05c67d097cc8c1c1a62f7d1623c))
* Revamped the auth application ([67d6c9e](https://github.com/Stundz/web/commit/67d6c9e808a7d05ab64b2bb0ccd542b8d235975a))


### Bug Fixes

* Migrated past-questions to resolvers ([2668bb3](https://github.com/Stundz/web/commit/2668bb39f4a1f266ce587a855748843e36275f3e))
* Tutorial sessions now send the correct date to backend ([d18271e](https://github.com/Stundz/web/commit/d18271e540c98f5967b0d4f9cc61814ff4c5bf9b))

## [5.2.0](https://github.com/Stundz/web/compare/v5.1.1...v5.2.0) (2025-10-26)


### Features

* Added global guards and resolvers for future use ([45214fa](https://github.com/Stundz/web/commit/45214fad1f4cb4501820d55e228cc45ffeada4c7))
* **auth:** redirect to home page on successful login ([88a9169](https://github.com/Stundz/web/commit/88a9169da75d15b1f15545ba839eb05e413ee683))
* **auth:** Users can now login ([2845f9b](https://github.com/Stundz/web/commit/2845f9b2b7c8ceef8ef1a73cd07236ea94963c97))
* Fix deployment issues with prerendered nested routes ([fe044d9](https://github.com/Stundz/web/commit/fe044d9d003dc590c08644d9ec3bba0d4014e087))
* Migrated from signal based data fetching to resolvers ([2de5aac](https://github.com/Stundz/web/commit/2de5aacdd7530ed6a4f8ec02223b19d5031a5ad1))
* Migrated from signal based data fetching to resolvers ([d1c9f65](https://github.com/Stundz/web/commit/d1c9f659ed19a4e6a53d39f8e785ab707abaa3fd))
* **plug:** Added component to display past tutorial session ([4d79192](https://github.com/Stundz/web/commit/4d79192827f8fd24bcf3c4056482722f0b84b4cf))
* **plug:** Created resolvers for future use ([6b7fe9f](https://github.com/Stundz/web/commit/6b7fe9f650e79348993fd0b93f52646e0843f2ae))
* **plug:** Created views for tutorial session ([26883fc](https://github.com/Stundz/web/commit/26883fcc5b4a31dff0415ff68a648417b47edbcd))
* **plug:** Load past questions uploaded by current user ([2626ac5](https://github.com/Stundz/web/commit/2626ac5a06a40974303507624f412e271834dd7a))
* **plug:** Made the tutorial show page dynamic ([2f7d595](https://github.com/Stundz/web/commit/2f7d5955dff78a20b6b5e2f7a50a29053bd542c2))
* **plug:** Show past questions fromt he currently authenticated user ([18d1aaf](https://github.com/Stundz/web/commit/18d1aafa72bc0cd982283b948056c4e6c7550651))


### Bug Fixes

* Add @parcel/watcher to trusted dependencies ([4b89e3e](https://github.com/Stundz/web/commit/4b89e3e4d52709874496d49e41030d790d7586db))
* **auth:** Added tailwindcss icon library ([30ebe32](https://github.com/Stundz/web/commit/30ebe325e1fc57fde708c3b13988cc2de8023c70))
* Fixed login with google button ([98e0e86](https://github.com/Stundz/web/commit/98e0e862846d4c6551865086e46e3ccdbbbda81a))
* **plug:** hide login/get started buttons when authenticated ([5061146](https://github.com/Stundz/web/commit/50611461fcec1cc068849e88a37b85de1f3063fc))
* **plug:** Show login/logout buttons conditionally ([9e6bcb9](https://github.com/Stundz/web/commit/9e6bcb92d839cf9829145158e2c8da800edaf343))
* **plug:** Updated models namespacing ([5509ed3](https://github.com/Stundz/web/commit/5509ed33b45bc9a329bf2163311d2cf1f7fe0e81))
* **plug:** Uses name from authenticated user ([1398668](https://github.com/Stundz/web/commit/1398668b3bf6516795d8cb0cb09803a2bbc995a1))
* Prevented infinite request from /csrf endpoint ([17eded8](https://github.com/Stundz/web/commit/17eded8da0db151df8d81f237e9467ed6884c78a))
* Prevents stundzInterceptor from making unnecessary repeated request ([d447d42](https://github.com/Stundz/web/commit/d447d42b457ddcea64de913ba4e4192f4a8e2b0a))
* Show database informations on tutorials/show page ([9643504](https://github.com/Stundz/web/commit/96435041dca12c5f429dc529c29a2194516c4a6e))

## [5.1.1](https://github.com/Stundz/web/compare/v5.1.0...v5.1.1) (2025-10-20)


### Bug Fixes

* fixed domain issue with the plugs app ([d9dc298](https://github.com/Stundz/web/commit/d9dc2982b6660c2caae0146697ea91986b69ef9c))
* package Updates ([ac57bb1](https://github.com/Stundz/web/commit/ac57bb1f8debe9fcbe35bc2672441615d7f479a0))

## [5.1.0](https://github.com/Stundz/web/compare/v5.0.1...v5.1.0) (2025-10-20)


### Features

* **auth:** Added oauth authorization page ([d164d87](https://github.com/Stundz/web/commit/d164d87a5b2e3daea85bfc83347c3650b149fe80))
* Generated the auth app ([7b018f7](https://github.com/Stundz/web/commit/7b018f7c12a31e3206ba595db8a71e158f474475))
* Migration from ngrx to services ([5be5699](https://github.com/Stundz/web/commit/5be5699a2734f61244de113786f98fee5cc612a5))


### Bug Fixes

* Added canonical URL for all pages ([4b8755f](https://github.com/Stundz/web/commit/4b8755f83061e0676ca6c431006d3778533deccc))
* **landing:** Fixed build issue with vercel ([71a1e99](https://github.com/Stundz/web/commit/71a1e99bafdcb658f6ffce9ddaebe451e20b0abe))

## [5.0.1](https://github.com/Stundz/web/compare/v5.0.0...v5.0.1) (2025-10-18)


### Bug Fixes

* **landing:** Fixed build issue with vercel ([f56ff67](https://github.com/Stundz/web/commit/f56ff6723c7dd697d0395e40fad748de547ab017))
* updated port for the landing page app ([46c4849](https://github.com/Stundz/web/commit/46c4849b67cbd215ef74321893d050a4a3beeb5f))

## [5.0.0](https://github.com/Stundz/web/compare/v4.4.1...v5.0.0) (2025-10-18)


### ⚠ BREAKING CHANGES

* Initialised the admin app

### Features

* Added vercel configurations for the admin application ([c4b8487](https://github.com/Stundz/web/commit/c4b8487a81c05a4327d19039656d76c4c3577899))
* Generated the landing page application ([dfdfa21](https://github.com/Stundz/web/commit/dfdfa210ab5bc790bbed6fb65cf75fde620a53d3))
* Initialised the admin app ([f8c7e57](https://github.com/Stundz/web/commit/f8c7e577c1f8be7175c508d2d213e500007cbe28))
* Removed netlify deployment configs ([9d02c4f](https://github.com/Stundz/web/commit/9d02c4f12f29ad3d6804b36379da0ba912ee14dd))


### Bug Fixes

* Assigned a port to the admin app ([f13e486](https://github.com/Stundz/web/commit/f13e48618d5906cae7862d77b3b1e2c50b51bee4))

## [4.4.1](https://github.com/Stundz/web/compare/v4.4.0...v4.4.1) (2025-10-17)


### Bug Fixes

* Added vercel function for auth and plug apps ([e22e434](https://github.com/Stundz/web/commit/e22e434878a1c8c04493279c535fed3ea9381c8e))

## [4.4.0](https://github.com/Stundz/web/compare/v4.3.0...v4.4.0) (2025-10-17)


### Features

* Removed the deployment job on Github CI/CD ([81f2542](https://github.com/Stundz/web/commit/81f25429ec32d2f162c012e7f9cc5e98008ebbbd))

## [4.3.0](https://github.com/Stundz/web/compare/v4.2.2...v4.3.0) (2025-10-17)


### Features

* updated vercel configs for good ([5607329](https://github.com/Stundz/web/commit/5607329a0fb0a30972fc2e47b43f0341aa7b7169))
* updated vercel configs for good ([5172efb](https://github.com/Stundz/web/commit/5172efbabe3f2a49181ec88ddd11ae47b122d166))

## [4.2.2](https://github.com/Stundz/web/compare/v4.2.1...v4.2.2) (2025-10-16)


### Bug Fixes

* Added netlify.toml to fix redirects issues ([42a1c27](https://github.com/Stundz/web/commit/42a1c2711e1f87ae56d581acd9bbf1b55a99be27))

## [4.2.1](https://github.com/Stundz/web/compare/v4.2.0...v4.2.1) (2025-10-16)


### Bug Fixes

* Fixed deploy CI/CD to running on release ([5cb8981](https://github.com/Stundz/web/commit/5cb89819e9f645b0f77e9d2415cc6e2540b525e1))

## [4.2.0](https://github.com/Stundz/web/compare/v4.1.1...v4.2.0) (2025-10-16)


### Features

* Configured deployments to occur only on release. ([fa4f79f](https://github.com/Stundz/web/commit/fa4f79f6e98a97e6a7c917ef59d9dd4f8247589d))


### Bug Fixes

* **deployment:** Removed unknown --interactive on deployment commands ([7e078b6](https://github.com/Stundz/web/commit/7e078b6001329da516a0667de1f1383b5ce59963))
* **deployment:** Removed unknown --interactive on deployment commands ([6b16f0d](https://github.com/Stundz/web/commit/6b16f0d74eab0df2f07403f74221ffca8fdb598f))

## [4.1.1](https://github.com/Stundz/web/compare/v4.1.0...v4.1.1) (2025-10-16)


### Bug Fixes

* Fixed bun command to build shared module ([8e6eade](https://github.com/Stundz/web/commit/8e6eade77d297eb1c0f5c2721c6f2661c98f7dcb))

## [4.1.0](https://github.com/Stundz/web/compare/v4.0.0...v4.1.0) (2025-10-16)


### Features

* Added deployments config for the auth app ([ee854ea](https://github.com/Stundz/web/commit/ee854ea21d08d4b7ed8808b6125422339592e28c))
* Configured deployments for the plug app via CI/CD ([ad725b9](https://github.com/Stundz/web/commit/ad725b9bc549cec6967d93c2cbe42d88225b37a6))

## [4.0.0](https://github.com/Stundz/web/compare/v3.0.0...v4.0.0) (2025-10-16)


### ⚠ BREAKING CHANGES

* Updated the release workflow to deploy manually using CI/CD
* **oauth:** Created the oauth application
* Added angular material to the plug app
* **plug:** Created the plug app
* **plug:** Created the plug app

### Features

* Added a PDF viewer component ([10442d5](https://github.com/Stundz/web/commit/10442d57acdf898d2f1b5a82f42804da3726a940))
* Added a toFormData utility function ([fb4151f](https://github.com/Stundz/web/commit/fb4151f88966bf7eb61d69ee3410095cd7d87e3e))
* Added angular material to the plug app ([0b35727](https://github.com/Stundz/web/commit/0b3572767279e21cfb0da31c5c03e5b4bf148cae))
* Added domain property of environment files ([8819652](https://github.com/Stundz/web/commit/88196523cf204a70b87f1a31e7ebf30d2a5b13a5))
* Added dropzone directive used for file uploads ([76f500e](https://github.com/Stundz/web/commit/76f500e5216a15c852ec084de37c8679ff46f58f))
* Added github workflows to organise releases ([5e3812d](https://github.com/Stundz/web/commit/5e3812d86de82106b5c6e9427ff9c4c8076c0494))
* Added images to open graph metadata ([6295411](https://github.com/Stundz/web/commit/629541129aff10b1d3dc397234aa9f9c02787b0c))
* Added meta tags to the application ([56f8b1f](https://github.com/Stundz/web/commit/56f8b1fb0af543091eae58aeb353efdf11f5e218))
* Added page to create tutorials ([89a2855](https://github.com/Stundz/web/commit/89a2855c784cae389527b4d1a459d75bc23df424))
* Added page to update tutorials ([1a40b8c](https://github.com/Stundz/web/commit/1a40b8c314e49c8663b15c1b55770e953874ee6f))
* Added routes for the tutors ([9dea190](https://github.com/Stundz/web/commit/9dea190937628a1959ad250560a4363b9eeb9c9a))
* Added the icons plugin to tailwindcss ([3800d2b](https://github.com/Stundz/web/commit/3800d2b215686228a1db1409c8f46cec35fc184b))
* Addressed issues for netlify CI/CD deployments ([13eda94](https://github.com/Stundz/web/commit/13eda94a224ff6cedf0082476ea05747525afe58))
* **auth:** Renamed oauth project to auth ([c19a693](https://github.com/Stundz/web/commit/c19a6931364407de2992a7159cf61d93956f905d))
* changed component prefix to from 'innova' to 'stundz' ([1cefbef](https://github.com/Stundz/web/commit/1cefbefba92045ed648df7039153661882d8700f))
* Created compatible function to help with netlify CI/CD deployments ([ff5d9c7](https://github.com/Stundz/web/commit/ff5d9c7bb8473313cd351a79b538de953fc96eb0))
* Created the tutorial service ([f1c627c](https://github.com/Stundz/web/commit/f1c627caa760d28f9a6fa028f25678d4a4568add))
* Deleted the pnpm lockfile ([b4e098a](https://github.com/Stundz/web/commit/b4e098a06f8a4a6b396224d9896027d24140ed9b))
* Installed tailwindcss ([5293537](https://github.com/Stundz/web/commit/52935374ae60a9aa569d728796fb9ca88b2b6986))
* **oauth:** Created the oauth application ([edc33ff](https://github.com/Stundz/web/commit/edc33ff99248de1c2796eca26a49985465ba13d5))
* **plug:** Created the plug app ([7dddfdf](https://github.com/Stundz/web/commit/7dddfdf6bcb39ab1c54092ee1589eb8305b000d0))
* **plug:** Created the plug app ([195a019](https://github.com/Stundz/web/commit/195a01952fb7c5fb6811f45d5d02fd03d2083a4e))
* **plug:** Migrated settings page to use material compoennts ([14e8ec0](https://github.com/Stundz/web/commit/14e8ec0366fbf31996d6795e9f62331bc9711fe5))
* ProvidedHttpClient module ([261a1f9](https://github.com/Stundz/web/commit/261a1f92cb32a950322a8f92cae837926518155c))
* Revamped the homepage ([b67454c](https://github.com/Stundz/web/commit/b67454c5b807d4d5c6834d0d2b5a9e31f3b88a2c))
* Revamped the UI of the current dashboard ([3f4ec46](https://github.com/Stundz/web/commit/3f4ec46f6983518a95f67f6f2714cc6223409eef))
* Updated the release workflow to deploy manually using CI/CD ([4f12b73](https://github.com/Stundz/web/commit/4f12b73a8060148f2ab2befa7647547f8f79b9ea))


### Bug Fixes

* Added past-question service to handle state ([3895191](https://github.com/Stundz/web/commit/3895191727c021c0f3c1e0ac2791ac8f9ebd53a7))
* Added robots.txt to configure sitemap.xml ([5c14dc0](https://github.com/Stundz/web/commit/5c14dc0fbf3e64199bb1db970474326ea214e39f))
* Build shared library on deployment ([9daf89f](https://github.com/Stundz/web/commit/9daf89fbc8995b38c0bb920888f0acd8ff29dc10))
* Changed API endpoint for production build ([72db100](https://github.com/Stundz/web/commit/72db1002d3328ee277281c7774a845f3c95ec2f3))
* Disabled prerendering for past question and tutorial routes ([9adb22d](https://github.com/Stundz/web/commit/9adb22d34ff01c4245e59b126acc44de1920d7aa))
* Made the sidebar to open and close on pc and mobile ([240480c](https://github.com/Stundz/web/commit/240480c0269f9c0748f73ab3b969b3053e6e7abc))
* Migrate login page to use angular material components ([a9d647d](https://github.com/Stundz/web/commit/a9d647d8f9264684c9556a7917fc0f07db27c546))
* Migrated signup page components to that of angular material ([6654a08](https://github.com/Stundz/web/commit/6654a08b66a4f4ac7f7a2b3a315945d4da904310))
* **plug:** Enabled production mode on deployments ([36566cf](https://github.com/Stundz/web/commit/36566cf199415bdc1614f6d08e87a3ba0b1183b1))
* Removed default angular template ([e92e5bc](https://github.com/Stundz/web/commit/e92e5bc0c878aa54494d5306c0f64da78e8b9d03))
* Renamed all occurencies of `Academic Plug` to `Plug` ([ef8c3ad](https://github.com/Stundz/web/commit/ef8c3ad5db73248c01f48266c6332d15d393ec2c))
* Renamed every innova to stundz ([5b0d103](https://github.com/Stundz/web/commit/5b0d103b768c8f1202a49c175c35aaedafe4d121))
* Renamed innova to stundz ([ceabd53](https://github.com/Stundz/web/commit/ceabd532d1ba33b5d5cc6aad7d08f3a432cd5bc1))
* Renamed package to stundz ([98d3c88](https://github.com/Stundz/web/commit/98d3c88761172876f12a67127d13c2e5af1ab412))
* rennamed innova to stundz ([4570a4c](https://github.com/Stundz/web/commit/4570a4c968b9a6c3ea56ec520ae517b4a9130d5a))
* Reorganised the tutorials routes ([760039e](https://github.com/Stundz/web/commit/760039e6de9d035d5528924777593e5071bd2355))
* Revamped the guest UI ([e23edef](https://github.com/Stundz/web/commit/e23edef418c6a0ec0e163a3f65e889fd96a3e1ab))
* Updated page to view a tutorial with its details ([bcfdae8](https://github.com/Stundz/web/commit/bcfdae8c25d120f14b69ffc0a86045e36ce7b1e5))
* Updated the past questions index view ([7a08299](https://github.com/Stundz/web/commit/7a082993c887e4d1a85ba1d4ec0778913487098e))
* Updated the UI of the signup page ([5326066](https://github.com/Stundz/web/commit/53260665db37dcd1e61e442dd65198aac9fd1258))
* Updated the UI to view all tutorials ([01032d5](https://github.com/Stundz/web/commit/01032d52ca9387e5e37971cc500bb6ba905b0571))
* Updated url of login ([ac3a888](https://github.com/Stundz/web/commit/ac3a8880ba76991ed206707d9601a0c9c71d1b59))
* Updated user interfaces and models ([7897109](https://github.com/Stundz/web/commit/78971093a92cf2b64d724928d144b1c662c05aae))
* Updated vercel server function ([b3fb35b](https://github.com/Stundz/web/commit/b3fb35b1d6f5737a2fc2340ce3809499c3c9b03d))

## [3.0.0](https://github.com/Stundz/web/compare/v2.1.0...v3.0.0) (2025-10-16)


### ⚠ BREAKING CHANGES

* Updated the release workflow to deploy manually using CI/CD
* **oauth:** Created the oauth application

### Features

* **auth:** Renamed oauth project to auth ([c19a693](https://github.com/Stundz/web/commit/c19a6931364407de2992a7159cf61d93956f905d))
* **oauth:** Created the oauth application ([edc33ff](https://github.com/Stundz/web/commit/edc33ff99248de1c2796eca26a49985465ba13d5))
* **plug:** Migrated settings page to use material compoennts ([14e8ec0](https://github.com/Stundz/web/commit/14e8ec0366fbf31996d6795e9f62331bc9711fe5))
* Updated the release workflow to deploy manually using CI/CD ([4f12b73](https://github.com/Stundz/web/commit/4f12b73a8060148f2ab2befa7647547f8f79b9ea))


### Bug Fixes

* Made the sidebar to open and close on pc and mobile ([240480c](https://github.com/Stundz/web/commit/240480c0269f9c0748f73ab3b969b3053e6e7abc))
* **plug:** Enabled production mode on deployments ([36566cf](https://github.com/Stundz/web/commit/36566cf199415bdc1614f6d08e87a3ba0b1183b1))

## [2.1.0](https://github.com/Stundz/web/compare/v2.0.0...v2.1.0) (2025-10-13)


### Features

* Created compatible function to help with netlify CI/CD deployments ([ff5d9c7](https://github.com/Stundz/web/commit/ff5d9c7bb8473313cd351a79b538de953fc96eb0))

## [2.0.0](https://github.com/Stundz/web/compare/v1.1.0...v2.0.0) (2025-10-13)


### ⚠ BREAKING CHANGES

* Added angular material to the plug app
* **plug:** Created the plug app
* **plug:** Created the plug app

### Features

* Added a PDF viewer component ([10442d5](https://github.com/Stundz/web/commit/10442d57acdf898d2f1b5a82f42804da3726a940))
* Added a toFormData utility function ([fb4151f](https://github.com/Stundz/web/commit/fb4151f88966bf7eb61d69ee3410095cd7d87e3e))
* Added angular material to the plug app ([0b35727](https://github.com/Stundz/web/commit/0b3572767279e21cfb0da31c5c03e5b4bf148cae))
* Added domain property of environment files ([8819652](https://github.com/Stundz/web/commit/88196523cf204a70b87f1a31e7ebf30d2a5b13a5))
* Added dropzone directive used for file uploads ([76f500e](https://github.com/Stundz/web/commit/76f500e5216a15c852ec084de37c8679ff46f58f))
* Added github workflows to organise releases ([5e3812d](https://github.com/Stundz/web/commit/5e3812d86de82106b5c6e9427ff9c4c8076c0494))
* Added images to open graph metadata ([6295411](https://github.com/Stundz/web/commit/629541129aff10b1d3dc397234aa9f9c02787b0c))
* Added meta tags to the application ([56f8b1f](https://github.com/Stundz/web/commit/56f8b1fb0af543091eae58aeb353efdf11f5e218))
* Added page to create tutorials ([89a2855](https://github.com/Stundz/web/commit/89a2855c784cae389527b4d1a459d75bc23df424))
* Added page to update tutorials ([1a40b8c](https://github.com/Stundz/web/commit/1a40b8c314e49c8663b15c1b55770e953874ee6f))
* Added routes for the tutors ([9dea190](https://github.com/Stundz/web/commit/9dea190937628a1959ad250560a4363b9eeb9c9a))
* Added the icons plugin to tailwindcss ([3800d2b](https://github.com/Stundz/web/commit/3800d2b215686228a1db1409c8f46cec35fc184b))
* Addressed issues for netlify CI/CD deployments ([13eda94](https://github.com/Stundz/web/commit/13eda94a224ff6cedf0082476ea05747525afe58))
* changed component prefix to from 'innova' to 'stundz' ([1cefbef](https://github.com/Stundz/web/commit/1cefbefba92045ed648df7039153661882d8700f))
* Created the tutorial service ([f1c627c](https://github.com/Stundz/web/commit/f1c627caa760d28f9a6fa028f25678d4a4568add))
* Deleted the pnpm lockfile ([b4e098a](https://github.com/Stundz/web/commit/b4e098a06f8a4a6b396224d9896027d24140ed9b))
* Installed tailwindcss ([5293537](https://github.com/Stundz/web/commit/52935374ae60a9aa569d728796fb9ca88b2b6986))
* **plug:** Created the plug app ([7dddfdf](https://github.com/Stundz/web/commit/7dddfdf6bcb39ab1c54092ee1589eb8305b000d0))
* **plug:** Created the plug app ([195a019](https://github.com/Stundz/web/commit/195a01952fb7c5fb6811f45d5d02fd03d2083a4e))
* ProvidedHttpClient module ([261a1f9](https://github.com/Stundz/web/commit/261a1f92cb32a950322a8f92cae837926518155c))
* Revamped the homepage ([b67454c](https://github.com/Stundz/web/commit/b67454c5b807d4d5c6834d0d2b5a9e31f3b88a2c))
* Revamped the UI of the current dashboard ([3f4ec46](https://github.com/Stundz/web/commit/3f4ec46f6983518a95f67f6f2714cc6223409eef))


### Bug Fixes

* Added past-question service to handle state ([3895191](https://github.com/Stundz/web/commit/3895191727c021c0f3c1e0ac2791ac8f9ebd53a7))
* Added robots.txt to configure sitemap.xml ([5c14dc0](https://github.com/Stundz/web/commit/5c14dc0fbf3e64199bb1db970474326ea214e39f))
* Changed API endpoint for production build ([72db100](https://github.com/Stundz/web/commit/72db1002d3328ee277281c7774a845f3c95ec2f3))
* Disabled prerendering for past question and tutorial routes ([9adb22d](https://github.com/Stundz/web/commit/9adb22d34ff01c4245e59b126acc44de1920d7aa))
* Migrate login page to use angular material components ([a9d647d](https://github.com/Stundz/web/commit/a9d647d8f9264684c9556a7917fc0f07db27c546))
* Migrated signup page components to that of angular material ([6654a08](https://github.com/Stundz/web/commit/6654a08b66a4f4ac7f7a2b3a315945d4da904310))
* Removed default angular template ([e92e5bc](https://github.com/Stundz/web/commit/e92e5bc0c878aa54494d5306c0f64da78e8b9d03))
* Renamed all occurencies of `Academic Plug` to `Plug` ([ef8c3ad](https://github.com/Stundz/web/commit/ef8c3ad5db73248c01f48266c6332d15d393ec2c))
* Renamed every innova to stundz ([5b0d103](https://github.com/Stundz/web/commit/5b0d103b768c8f1202a49c175c35aaedafe4d121))
* Renamed innova to stundz ([ceabd53](https://github.com/Stundz/web/commit/ceabd532d1ba33b5d5cc6aad7d08f3a432cd5bc1))
* Renamed package to stundz ([98d3c88](https://github.com/Stundz/web/commit/98d3c88761172876f12a67127d13c2e5af1ab412))
* rennamed innova to stundz ([4570a4c](https://github.com/Stundz/web/commit/4570a4c968b9a6c3ea56ec520ae517b4a9130d5a))
* Reorganised the tutorials routes ([760039e](https://github.com/Stundz/web/commit/760039e6de9d035d5528924777593e5071bd2355))
* Revamped the guest UI ([e23edef](https://github.com/Stundz/web/commit/e23edef418c6a0ec0e163a3f65e889fd96a3e1ab))
* Updated page to view a tutorial with its details ([bcfdae8](https://github.com/Stundz/web/commit/bcfdae8c25d120f14b69ffc0a86045e36ce7b1e5))
* Updated the past questions index view ([7a08299](https://github.com/Stundz/web/commit/7a082993c887e4d1a85ba1d4ec0778913487098e))
* Updated the UI of the signup page ([5326066](https://github.com/Stundz/web/commit/53260665db37dcd1e61e442dd65198aac9fd1258))
* Updated the UI to view all tutorials ([01032d5](https://github.com/Stundz/web/commit/01032d52ca9387e5e37971cc500bb6ba905b0571))
* Updated url of login ([ac3a888](https://github.com/Stundz/web/commit/ac3a8880ba76991ed206707d9601a0c9c71d1b59))
* Updated user interfaces and models ([7897109](https://github.com/Stundz/web/commit/78971093a92cf2b64d724928d144b1c662c05aae))
* Updated vercel server function ([b3fb35b](https://github.com/Stundz/web/commit/b3fb35b1d6f5737a2fc2340ce3809499c3c9b03d))

## [1.1.0](https://github.com/Stundz/web/compare/v1.0.0...v1.1.0) (2025-10-12)


### Features

* Added a toFormData utility function ([fb4151f](https://github.com/Stundz/web/commit/fb4151f88966bf7eb61d69ee3410095cd7d87e3e))
* Added dropzone directive used for file uploads ([76f500e](https://github.com/Stundz/web/commit/76f500e5216a15c852ec084de37c8679ff46f58f))
* Added page to create tutorials ([89a2855](https://github.com/Stundz/web/commit/89a2855c784cae389527b4d1a459d75bc23df424))
* Added page to update tutorials ([1a40b8c](https://github.com/Stundz/web/commit/1a40b8c314e49c8663b15c1b55770e953874ee6f))
* Addressed issues for netlify CI/CD deployments ([13eda94](https://github.com/Stundz/web/commit/13eda94a224ff6cedf0082476ea05747525afe58))
* changed component prefix to from 'innova' to 'stundz' ([1cefbef](https://github.com/Stundz/web/commit/1cefbefba92045ed648df7039153661882d8700f))
* Created the tutorial service ([f1c627c](https://github.com/Stundz/web/commit/f1c627caa760d28f9a6fa028f25678d4a4568add))
* Deleted the pnpm lockfile ([b4e098a](https://github.com/Stundz/web/commit/b4e098a06f8a4a6b396224d9896027d24140ed9b))
* Revamped the UI of the current dashboard ([3f4ec46](https://github.com/Stundz/web/commit/3f4ec46f6983518a95f67f6f2714cc6223409eef))


### Bug Fixes

* Added past-question service to handle state ([3895191](https://github.com/Stundz/web/commit/3895191727c021c0f3c1e0ac2791ac8f9ebd53a7))
* Changed API endpoint for production build ([72db100](https://github.com/Stundz/web/commit/72db1002d3328ee277281c7774a845f3c95ec2f3))
* Disabled prerendering for past question and tutorial routes ([9adb22d](https://github.com/Stundz/web/commit/9adb22d34ff01c4245e59b126acc44de1920d7aa))
* Renamed every innova to stundz ([5b0d103](https://github.com/Stundz/web/commit/5b0d103b768c8f1202a49c175c35aaedafe4d121))
* Renamed innova to stundz ([ceabd53](https://github.com/Stundz/web/commit/ceabd532d1ba33b5d5cc6aad7d08f3a432cd5bc1))
* Renamed package to stundz ([98d3c88](https://github.com/Stundz/web/commit/98d3c88761172876f12a67127d13c2e5af1ab412))
* rennamed innova to stundz ([4570a4c](https://github.com/Stundz/web/commit/4570a4c968b9a6c3ea56ec520ae517b4a9130d5a))
* Reorganised the tutorials routes ([760039e](https://github.com/Stundz/web/commit/760039e6de9d035d5528924777593e5071bd2355))
* Revamped the guest UI ([e23edef](https://github.com/Stundz/web/commit/e23edef418c6a0ec0e163a3f65e889fd96a3e1ab))
* Updated page to view a tutorial with its details ([bcfdae8](https://github.com/Stundz/web/commit/bcfdae8c25d120f14b69ffc0a86045e36ce7b1e5))
* Updated the past questions index view ([7a08299](https://github.com/Stundz/web/commit/7a082993c887e4d1a85ba1d4ec0778913487098e))
* Updated the UI of the signup page ([5326066](https://github.com/Stundz/web/commit/53260665db37dcd1e61e442dd65198aac9fd1258))
* Updated the UI to view all tutorials ([01032d5](https://github.com/Stundz/web/commit/01032d52ca9387e5e37971cc500bb6ba905b0571))
* Updated user interfaces and models ([7897109](https://github.com/Stundz/web/commit/78971093a92cf2b64d724928d144b1c662c05aae))
* Updated vercel server function ([b3fb35b](https://github.com/Stundz/web/commit/b3fb35b1d6f5737a2fc2340ce3809499c3c9b03d))

## 1.0.0 (2025-10-11)


### ⚠ BREAKING CHANGES

* Added angular material to the plug app
* **plug:** Created the plug app
* **plug:** Created the plug app

### Features

* Added angular material to the plug app ([0b35727](https://github.com/Stundz/web/commit/0b3572767279e21cfb0da31c5c03e5b4bf148cae))
* Added the icons plugin to tailwindcss ([3800d2b](https://github.com/Stundz/web/commit/3800d2b215686228a1db1409c8f46cec35fc184b))
* Installed tailwindcss ([5293537](https://github.com/Stundz/web/commit/52935374ae60a9aa569d728796fb9ca88b2b6986))
* **plug:** Created the plug app ([7dddfdf](https://github.com/Stundz/web/commit/7dddfdf6bcb39ab1c54092ee1589eb8305b000d0))
* **plug:** Created the plug app ([195a019](https://github.com/Stundz/web/commit/195a01952fb7c5fb6811f45d5d02fd03d2083a4e))
* ProvidedHttpClient module ([261a1f9](https://github.com/Stundz/web/commit/261a1f92cb32a950322a8f92cae837926518155c))


### Bug Fixes

* Removed default angular template ([e92e5bc](https://github.com/Stundz/web/commit/e92e5bc0c878aa54494d5306c0f64da78e8b9d03))
