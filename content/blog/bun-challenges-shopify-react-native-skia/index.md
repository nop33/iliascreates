---
title: "Bun challenges: @shopify/react-native-skia"
date: "2023-11-21T13:51:00.000Z"
description: ""
---

At work we recently switched from a poly-repo to a mono-repo set up and from using npm to using [Bun](https://bun.sh/) as our project manager. One of the challenges that I faced today was that I could not run our React Native app in an Android simulator anymore. The main error I was getting was this:

```
    Cannot find source file:

      node_modules/@shopify/react-native-skia/android/cpp/jsi/JsiHostObject.cpp

```

<details><summary>Click here for full traceback</summary>

```
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':shopify_react-native-skia:configureCMakeDebug[arm64-v8a]'.
> [CXX1429] error when building with cmake using /path/to/monorepo/node_modules/@shopify/react-native-skia/android/CMakeLists.txt: -- Android: Targeting API '21' with architecture 'arm64', ABI 'arm64-v8a', and processor 'aarch64'
  -- Android: Selected unified Clang toolchain
  -- The C compiler identification is Clang 12.0.8
  -- The CXX compiler identification is Clang 12.0.8
  -- Detecting C compiler ABI info
  -- Detecting C compiler ABI info - done
  -- Check for working C compiler: /path/to/android/sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang - skipped
  -- Detecting C compile features
  -- Detecting C compile features - done
  -- Detecting CXX compiler ABI info
  -- Detecting CXX compiler ABI info - done
  -- Check for working CXX compiler: /path/to/android/sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang++ - skipped
  -- Detecting CXX compile features
  -- Detecting CXX compile features - done
  -- Configuring done

  C++ build system [configure] failed while executing:
      /path/to/android/sdk/cmake/3.22.1/bin/cmake \
        -H/path/to/monorepo/node_modules/@shopify/react-native-skia/android \
        -DCMAKE_SYSTEM_NAME=Android \
        -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
        -DCMAKE_SYSTEM_VERSION=21 \
        -DANDROID_PLATFORM=android-21 \
        -DANDROID_ABI=arm64-v8a \
        -DCMAKE_ANDROID_ARCH_ABI=arm64-v8a \
        -DANDROID_NDK=/path/to/android/sdk/ndk/23.1.7779620 \
        -DCMAKE_ANDROID_NDK=/path/to/android/sdk/ndk/23.1.7779620 \
        -DCMAKE_TOOLCHAIN_FILE=/path/to/android/sdk/ndk/23.1.7779620/build/cmake/android.toolchain.cmake \
        -DCMAKE_MAKE_PROGRAM=/path/to/android/sdk/cmake/3.22.1/bin/ninja \
        "-DCMAKE_CXX_FLAGS=-fexceptions -frtti -std=c++1y -DONANDROID" \
        -DCMAKE_LIBRARY_OUTPUT_DIRECTORY=/path/to/monorepo/node_modules/@shopify/react-native-skia/android/build/intermediates/cxx/Debug/5v1r3a6q/obj/arm64-v8a \
        -DCMAKE_RUNTIME_OUTPUT_DIRECTORY=/path/to/monorepo/node_modules/@shopify/react-native-skia/android/build/intermediates/cxx/Debug/5v1r3a6q/obj/arm64-v8a \
        -DCMAKE_BUILD_TYPE=Debug \
        -DCMAKE_FIND_ROOT_PATH=/path/to/monorepo/node_modules/@shopify/react-native-skia/android/.cxx/Debug/5v1r3a6q/prefab/arm64-v8a/prefab \
        -B/path/to/monorepo/node_modules/@shopify/react-native-skia/android/.cxx/Debug/5v1r3a6q/arm64-v8a \
        -GNinja \
        -DANDROID_STL=c++_shared \
        -DREACT_NATIVE_VERSION=72 \
        -DNODE_MODULES_DIR=/path/to/monorepo/node_modules \
        "-DPREBUILT_DIR=/path/to/monorepo/node_modules/@shopify/react-native-skia/android/build/react-native-0*/jni"
    from /path/to/monorepo/node_modules/@shopify/react-native-skia/android
  -- ABI     : arm64-v8a
  -- PREBUILT: /path/to/monorepo/node_modules/@shopify/react-native-skia/android/build/react-native-0*/jni
  -- BUILD   : /path/to/monorepo/node_modules/@shopify/react-native-skia/android/build
  -- LIBRN   :
  -- LOG     : /path/to/android/sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/darwin-x86_64/sysroot/usr/lib/aarch64-linux-android/21/liblog.so
  -- JSI     : ReactAndroid::jsi
  -- REACT   : ReactAndroid::react_nativemodule_core
  -- FBJNI   : fbjni::fbjni
  -- TURBO   : ReactAndroid::turbomodulejsijni
  CMake Error at CMakeLists.txt:40 (add_library):
    Cannot find source file:

      /path/to/monorepo/node_modules/@shopify/react-native-skia/android/cpp/jsi/JsiHostObject.cpp

    Tried extensions .c .C .c++ .cc .cpp .cxx .cu .mpp .m .M .mm .ixx .cppm .h
    .hh .h++ .hm .hpp .hxx .in .txx .f .F .for .f77 .f90 .f95 .f03 .hip .ispc


  CMake Error at CMakeLists.txt:40 (add_library):
    No SOURCES given to target: rnskia


  CMake Generate step failed.  Build files cannot be regenerated correctly.
```

</details>

However, the following file DID exist:

```
node_modules/@shopify/react-native-skia/cpp/jsi/JsiHostObject.cpp
```

Seems like some symlinking is not working properly.

This [unrelated issue](https://github.com/Shopify/react-native-skia/issues/780) reminded me that:

> Bun does not execute arbitrary lifecycle scripts for installed dependencies, such as postinstall and node-gyp builds
> https://bun.sh/guides/install/trusted

## Solution

Adding a `trustedDependencies` property in the package.json file of my project, deleting the `bun.lockb` file and `node_modules` and reinstalling with `bun i` fixed the issue:

```json
  "trustedDependencies": [
    "@shopify/react-native-skia"
  ]
```

```shell
rm -rf node_modules
rm bun.lockb
bun i
```

This is also verified when looking at the logs og the `bun i` command:

```
Updating symlinks for Android build...
Creating symlink to api /path/to/monorepo/node_modules/@shopify/react-native-skia/scripts /path/to/monorepo/node_modules/@shopify/react-native-skia
Creating symlink to jsi /path/to/monorepo/node_modules/@shopify/react-native-skia/scripts /path/to/monorepo/node_modules/@shopify/react-native-skia
Creating symlink to rnskia /path/to/monorepo/node_modules/@shopify/react-native-skia/scripts /path/to/monorepo/node_modules/@shopify/react-native-skia
Creating symlink to skia /path/to/monorepo/node_modules/@shopify/react-native-skia/scripts /path/to/monorepo/node_modules/@shopify/react-native-skia
Creating symlink to utils /path/to/monorepo/node_modules/@shopify/react-native-skia/scripts /path/to/monorepo/node_modules/@shopify/react-native-skia
Symlinks created successfully.
```
