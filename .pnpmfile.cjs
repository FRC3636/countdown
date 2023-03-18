function readPackage(pkg, context) {
    if (pkg.peerDependencies?.react) {
      delete pkg.peerDependencies.react;
      pkg.peerDependencies['preact'] = '*';
    }

    if (pkg.peerDependencies?.['react-dom']) {
        delete pkg.peerDependencies['react-dom'];
        pkg.peerDependencies['preact'] = '*';
    }

    return pkg
  }

  module.exports = {
    hooks: {
      readPackage
    }
  }
