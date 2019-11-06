import { wrap } from "../../lib";

type Path = {
    path: string,
    backend: {
        serviceName: string,
        servicePort: number,
    }
};

type Rule = {
    host: string,
    http: {
        paths: Path[]
    }
};

type Tls = {
    hosts?: string[],
    secretName: string,
};

type Ingress = {
    metadata?: {
        annotations?: {
            "kubernetes.io/ingress.class"?: string
            "nginx.ingress.kubernetes.io/proxy-body-size"?: string
            "nginx.ingress.kubernetes.io/large-client-header-buffers"?: string
            "nginx.ingress.kubernetes.io/client-header-buffer-size"?: string
            "nginx.ingress.kubernetes.io/proxy-read-timeout"?: string
            "nginx.ingress.kubernetes.io/proxy-send-timeout"?: string
            "nginx.ingress.kubernetes.io/limit-connections"?: string
            "nginx.ingress.kubernetes.io/configuration-snippet"?: string
        },
    },
    spec: {
        tls: Tls[],
        rules: Rule[]
    }
};

export const Ingress = wrap<Ingress, { apiVersion: "networking.k8s.io/v1beta1", kind: "Ingress" }>({
    apiVersion: "networking.k8s.io/v1beta1",
    kind: "Ingress",
});