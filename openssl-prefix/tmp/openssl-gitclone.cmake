
if(NOT "/Users/yamaurakazuki/Lecture/3rd/COJT/TachometerAPI/web_tachometer_demo/openssl-prefix/src/openssl-stamp/openssl-gitinfo.txt" IS_NEWER_THAN "/Users/yamaurakazuki/Lecture/3rd/COJT/TachometerAPI/web_tachometer_demo/openssl-prefix/src/openssl-stamp/openssl-gitclone-lastrun.txt")
  message(STATUS "Avoiding repeated git clone, stamp file is up to date: '/Users/yamaurakazuki/Lecture/3rd/COJT/TachometerAPI/web_tachometer_demo/openssl-prefix/src/openssl-stamp/openssl-gitclone-lastrun.txt'")
  return()
endif()

execute_process(
  COMMAND ${CMAKE_COMMAND} -E rm -rf "/Users/yamaurakazuki/Lecture/3rd/COJT/TachometerAPI/web_tachometer_demo/openssl-prefix/src/openssl"
  RESULT_VARIABLE error_code
  )
if(error_code)
  message(FATAL_ERROR "Failed to remove directory: '/Users/yamaurakazuki/Lecture/3rd/COJT/TachometerAPI/web_tachometer_demo/openssl-prefix/src/openssl'")
endif()

# try the clone 3 times in case there is an odd git clone issue
set(error_code 1)
set(number_of_tries 0)
while(error_code AND number_of_tries LESS 3)
  execute_process(
    COMMAND "/usr/local/bin/git"  clone --no-checkout --config "advice.detachedHead=false" "https://github.com/openssl/openssl" "openssl"
    WORKING_DIRECTORY "/Users/yamaurakazuki/Lecture/3rd/COJT/TachometerAPI/web_tachometer_demo/openssl-prefix/src"
    RESULT_VARIABLE error_code
    )
  math(EXPR number_of_tries "${number_of_tries} + 1")
endwhile()
if(number_of_tries GREATER 1)
  message(STATUS "Had to git clone more than once:
          ${number_of_tries} times.")
endif()
if(error_code)
  message(FATAL_ERROR "Failed to clone repository: 'https://github.com/openssl/openssl'")
endif()

execute_process(
  COMMAND "/usr/local/bin/git"  checkout master --
  WORKING_DIRECTORY "/Users/yamaurakazuki/Lecture/3rd/COJT/TachometerAPI/web_tachometer_demo/openssl-prefix/src/openssl"
  RESULT_VARIABLE error_code
  )
if(error_code)
  message(FATAL_ERROR "Failed to checkout tag: 'master'")
endif()

set(init_submodules TRUE)
if(init_submodules)
  execute_process(
    COMMAND "/usr/local/bin/git"  submodule update --recursive --init 
    WORKING_DIRECTORY "/Users/yamaurakazuki/Lecture/3rd/COJT/TachometerAPI/web_tachometer_demo/openssl-prefix/src/openssl"
    RESULT_VARIABLE error_code
    )
endif()
if(error_code)
  message(FATAL_ERROR "Failed to update submodules in: '/Users/yamaurakazuki/Lecture/3rd/COJT/TachometerAPI/web_tachometer_demo/openssl-prefix/src/openssl'")
endif()

# Complete success, update the script-last-run stamp file:
#
execute_process(
  COMMAND ${CMAKE_COMMAND} -E copy
    "/Users/yamaurakazuki/Lecture/3rd/COJT/TachometerAPI/web_tachometer_demo/openssl-prefix/src/openssl-stamp/openssl-gitinfo.txt"
    "/Users/yamaurakazuki/Lecture/3rd/COJT/TachometerAPI/web_tachometer_demo/openssl-prefix/src/openssl-stamp/openssl-gitclone-lastrun.txt"
  RESULT_VARIABLE error_code
  )
if(error_code)
  message(FATAL_ERROR "Failed to copy script-last-run stamp file: '/Users/yamaurakazuki/Lecture/3rd/COJT/TachometerAPI/web_tachometer_demo/openssl-prefix/src/openssl-stamp/openssl-gitclone-lastrun.txt'")
endif()

