@ECHO OFF
REM assuming CD is currently at root of project
SET DEBUG=node-emitter-details
CD ./test
REM double quotes around %%f are needed cause the filename has a space
FOR /r %%f IN (*) DO  ( ECHO NODE TESTING: & ECHO. %%f & ECHO ---
  node "%%f" )
CD ../

REM TODO use colors to output progress
REM TODO exit automatically if not error
