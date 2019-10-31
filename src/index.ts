import core from "./core";
export { Base64 } from "./util/base64";
import { Api } from "./http/";
import { Kubeconfig } from "./http/kubeconfig";


import { inspect } from "util";
export const k8s = {
    core
};

async function main() {
    const kc = await Kubeconfig.default();
    const [cluster, user] = kc.get_current()
    const api = Api.new({
        server_root: cluster.server,
        cacert: cluster.cert,
        client_cert: user.cert,
        client_key: user.key,
    });
    const res = await api.get("/api/v1/namespaces");
    const body = await res.data();
    const data = JSON.parse(body.toString("utf8"));
    console.log(inspect(data, { colors: true, depth: 10 }));
}

main().catch((e) => {
    console.error(e);
    process.exit(1)
});