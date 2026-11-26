cmake_minimum_required(VERSION 3.20)
project(church_media_ndi_sender LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(NDI_SDK_ROOT "C:/Program Files/NDI/NDI 6 SDK" CACHE PATH "NDI SDK installation")
find_path(NDI_INCLUDE_DIR Processing.NDI.Lib.h
  PATHS "${NDI_SDK_ROOT}/Include" REQUIRED)
find_library(NDI_LIBRARY
  NAMES Processing.NDI.Lib.x64
  PATHS "${NDI_SDK_ROOT}/Lib/x64" REQUIRED)

add_executable(ndi_sender ndi_sender.cpp)
target_include_directories(ndi_sender PRIVATE "${NDI_INCLUDE_DIR}")
target_link_libraries(ndi_sender PRIVATE "${NDI_LIBRARY}")

if(MSVC)
  target_compile_options(ndi_sender PRIVATE /W4 /EHsc)
endif()
