
This a progressive web app that displays fortunes from the I Ching.

Home page for this project is https://elf.org/change.

The app is available as https://change.elf.org.

Built with the https://github.com/Polymer/pwa-starter-kit using https://polymer-project.org.

To build you'll need to:
[ ] install nodejs and npm,
[ ] may need to install polymer-cli as a global npm app
    consult the pwa-starter for better details
[ ] run "npm install" in the top level directory
[ ] install tclsh and make
    these are my legacy tools, sorry.
[ ] run (cd resources && make) in the top level directory
    to construct the javascript sources for the translations
[ ] at this point you should be able to run "polymer serve"
    in the top level directory and open the web app in your
    browser at http://localhost:8081

To build build, run "npm run build" in the top-level directory
and static images in build/ and a prpl-server suite of images
in server/ will be compiled.

