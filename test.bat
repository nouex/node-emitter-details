@ECHO OFF
REM assuming CD is currently at root of project
SET DEBUG=node-emitter-details
CD ./test
REM double quotes around %%f are needed cause the filename has a space
FOR /r %%f IN (*) DO (
  REM get file name
  FOR %%F in ("%%f") DO (
      ECHO NODE TESTING: %%~nxF & ECHO -----
      node "%%f"
  )
)
CD ../

REM TODO use colors to output progress
REM TODO exit automatically if not error
