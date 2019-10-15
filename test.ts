import { k8s, Base64 } from "./src";
import { stringify } from "yaml";

const my_secret = k8s.core.v1.Secret("my-secret", {
    metadata: {
        namespace: "default"
    },
    type: "kubernetes.io/basic-auth",
    data: {
        username: Base64.encode("alice"),
        password: Base64.preencoded("UGEkJHcwcmQh")
    },
});

console.info(stringify(my_secret));