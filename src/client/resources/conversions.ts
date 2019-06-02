export function createTokenSecret(name: string, namespace: string, rawToken: string) {
  // btoa => to base64, atob => from base64
  const encodedToken = btoa(rawToken);
  return {
    apiVersion: 'v1',
    data: {
      saToken: encodedToken,
    },
    kind: 'Secret',
    metadata: {
      name,
      namespace,
    },
    type: 'Opaque',
  };
}

export function updateTokenSecret(rawToken: string) {
  // btoa => to base64, atob => from base64
  const encodedToken = btoa(rawToken);
  return {
    data: {
      saToken: encodedToken,
    },
  };
}

export function tokenFromSecret(secret: any) {
  return atob(secret.data.token);
}

export function createClusterRegistryObj(name: string, namespace: string, serverAddress: string) {
  return {
    apiVersion: 'clusterregistry.k8s.io/v1alpha1',
    kind: 'Cluster',
    metadata: {
      name,
      namespace,
    },
    spec: {
      kubernetesApiEndpoints: {
        serverEndpoints: [
          {
            clientCIDR: '0.0.0.0',
            serverAddress,
          },
        ],
      },
    },
  };
}

export function updateClusterRegistryObj(serverAddress: string) {
  return {
      spec: {
        kubernetesApiEndpoints: {
          serverEndpoints: [
            {
              clientCIDR: '0.0.0.0',
              serverAddress,
            },
          ],
        },
      }
  };
}

export function createMigCluster(
  name: string,
  namespace: string,
  clusterRegistryObj: any,
  tokenSecret: any
) {
  return {
    apiVersion: 'migration.openshift.io/v1alpha1',
    kind: 'MigCluster',
    metadata: {
      name,
      namespace,
    },
    spec: {
      isHostCluster: false,
      clusterRef: {
        name: clusterRegistryObj.metadata.name,
        namespace: clusterRegistryObj.metadata.namespace,
      },
      serviceAccountSecretRef: {
        name: tokenSecret.metadata.name,
        namespace: tokenSecret.metadata.namespace,
      },
    },
  };
}

// TODO:  Initial phase, ignore the 'name' updating for the objects.
//  That means no changes them to MigCluster
export function updateMigCluster(
  name: string,
  namespace: string,
  clusterRegistryObj: any,
  tokenSecret: any
) {
  return {
      clusterRef: {
        name: clusterRegistryObj.metadata.name,
      },
      serviceAccountSecretRef: {
        name: tokenSecret.metadata.name,
      },
  };
}

export function createMigStorage(
  name: string,
  bucketName: string,
  bucketRegion: string,
  namespace: string,
  tokenSecret: any
) {
  return {
    apiVersion: 'migration.openshift.io/v1alpha1',
    kind: 'MigStorage',
    metadata: {
      name,
      namespace,
    },
    spec: {
      backupStorageProvider: 'aws',
      volumeSnapshotProvider: 'aws',
      backupStorageConfig: {
        awsBucketName: bucketName,
        awsRegion: bucketRegion,
        credsSecretRef: {
          name: tokenSecret.metadata.name,
          namespace: tokenSecret.metadata.namespace,
        },
      },
      volumeSnapshotConfig: {
        awsRegion: bucketRegion,
        credsSecretRef: {
          name: tokenSecret.metadata.name,
          namespace: tokenSecret.metadata.namespace,
        },
      },
    },
  };
}

export function createStorageSecret(
  name: string,
  namespace: string,
  secretKey: any,
  accessKey: string
) {
  // btoa => to base64, atob => from base64
  const encodedAccessKey = btoa(accessKey);
  const encodedSecretKey = btoa(secretKey);
  return {
    apiVersion: 'v1',
    data: {
      'aws-access-key-id': encodedAccessKey,
      'aws-secret-access-key-id': encodedSecretKey,
    },
    kind: 'Secret',
    metadata: {
      name,
      namespace,
    },
    type: 'Opaque',
  };
}

export function createMigPlan(
  name: string,
  namespace: string,
  sourceClusterObj: any,
  destinationClusterObj: any,
  storageObj: any,
  assetObj: any
) {
  return {
    apiVersion: 'migration.openshift.io/v1alpha1',
    kind: 'MigPlan',
    metadata: {
      name,
      namespace,
    },
    spec: {
      srcMigClusterRef: {
        name: sourceClusterObj,
        namespace,
      },
      destMigClusterRef: {
        name: destinationClusterObj,
        namespace,
      },
      migStorageRef: {
        name: storageObj,
        namespace,
      },
      migAssetCollectionRef: {
        name: assetObj,
        namespace,
      },
    },
  };
}
export function createMigMigration(migID: string, planName: string, namespace: string) {
  return {
    apiVersion: 'migration.openshift.io/v1alpha1',
    kind: 'MigMigration',
    metadata: {
      name: migID,
      namespace,
    },
    spec: {
      migPlanRef: {
        name: planName,
        namespace,
      },
    },
  };
}
