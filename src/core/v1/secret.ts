import { Base64 } from "../../util/base64";
import { wrap } from "../../lib";

// ref: https://github.com/kubernetes/kubernetes/blob/2b21f087eb74060a876fa05e9d430ea7db4c252e/pkg/apis/core/types.go

type Opaque = {
    type: "Opaque",
    data: Record<string, Base64>,
};

type ServiceAccoutToken = {
    metadata: {
        annotations: {
            "kubernetes.io/service-account.name": string
            // "kubernetes.io/service-account.uid": string
        },
    },
    type: "kubernetes.io/service-account-token",
    data: {
        token: Base64,
        "kubernetes.kubeconfig"?: Base64,
        "ca.crt"?: Base64,
        namespace?: Base64,
    },
};

type DockerCfg = {
    type: "kubernetes.io/dockercfg",
    data: {
        /// a serialized ~/.dockercfg file
        ".dockercfg": Base64
    },
};

type DockerConfigJson = {
    type: "kubernetes.io/dockerconfigjson",
    data: {
        ".dockerconfigjson": Base64
    },
};

type BasicAuth = {
    type: "kubernetes.io/basic-auth",
    data: {
        username: Base64,
        password: Base64,
    },
};

type SshAuth = {
    type: "kubernetes.io/ssh-auth",
    data: {
        "ssh-privatekey": Base64,
    },
};

type Tls = {
    type: "kubernetes.io/tls",
    data: {
        "tls.key": Base64,
        "tls.crt": Base64,
    },
};

type BootstrapToken = {
    type: "bootstrap.kubernetes.io/token",
    data: {
        "tls.key": Base64,
        "tls.crt": Base64,
    },
};

type Secret = Opaque | ServiceAccoutToken | DockerCfg | DockerConfigJson | BasicAuth | SshAuth | Tls | BootstrapToken;

export const Secret = wrap<Secret, { apiVersion: "v1", kind: "Secret" }>({
    apiVersion: "v1",
    kind: "Secret",
});
