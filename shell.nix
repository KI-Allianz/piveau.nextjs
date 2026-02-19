{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # nativeBuildInputs for tools, buildInputs for libraries
  nativeBuildInputs = with pkgs; [ 
    # nodejs_24
    pnpm
    cypress 
  ];

  # Essential for Cypress to find graphics drivers on NixOS
  LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
    pkgs.stdenv.cc.cc
    pkgs.libGL
    pkgs.glib
    pkgs.nss
    pkgs.nspr
  ];

  shellHook = ''
    export CYPRESS_RUN_BINARY="${pkgs.cypress}/bin/Cypress"
    export CYPRESS_INSTALL_BINARY=0

    # This usually relates to X11/Wayland communication
    export QT_X11_NO_MITSHM=1
    export _JAVA_AWT_WM_NONREPARENTING=1
    
    echo "Cypress NixOS Environment Ready"
  '';
}
