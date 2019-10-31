import Yaml from "yaml";
import { promisify } from "util";
import { readFile as readFileCb, promises } from "fs";
import { homedir } from "os";
import { join } from "path";

const readFile = promisify(readFileCb);

type ClusterStruct = {
    name: string,
    cluster: {
        server: string,
        "certificate-authority-data": string,
    },
};
type ContextStrct = {
    name: string,
    context: {
        cluster: string,
        user: string,
    },
};
type UserStruct = {
    name: string,
    user: {
        "client-certificate-data": string,
        "client-key-data": string,
    },
};


type KubeconfigStruct = {
    apiVersion: string, // "v1"
    kind: string, // "Config"
    preferences: {},
    clusters: ClusterStruct[],
    contexts: ContextStrct[],
    users: UserStruct[],
    "current-context": string,
};

function base64decode(b64: string): string {
    try {
        return Buffer.from(b64, "base64").toString("ascii");
    } catch (e) {
        throw new KubeconfigError(`Could not base64-decode "${b64}"`, e);
    }
}

class User {
    constructor(public name: string, public cert: string, public key: string) { }
}
class Cluster {
    constructor(public name: string, public server: string, public cert: string) { }
}
class Context {
    constructor(public name: string, public cluster: string, public user: string) { }
}

export class KubeconfigError extends Error {
    constructor(message: string, private cause?: Error) {
        super(message);
    }
}

export class Kubeconfig {
    static fromYaml(yaml: string): Kubeconfig {
        let parsed;
        try {
            parsed = Yaml.parse(yaml);
        } catch (e) {
            throw new KubeconfigError(`Could not parse yaml`, e);
        }
        return new Kubeconfig(parsed);
    }
    static fromJson(json: string): Kubeconfig {
        let parsed;
        try {
            parsed = JSON.parse(json);
        } catch (e) {
            throw new KubeconfigError(`Could not parse yaml`, e);
        }
        return new Kubeconfig(parsed);
    }
    static fromYamlOrJson(json_or_yaml: string): Kubeconfig {
        try { // this is bad but convenient :(
            return Kubeconfig.fromYaml(json_or_yaml);
        } catch (_e) {
        }
        return Kubeconfig.fromJson(json_or_yaml);
    }

    /**
     * Read kubeconfig from file, format is determined based on
     * sofisticated heuristics:
     *  - .json extension is loaded as json
     *  - .yaml extension is loaded as yaml
     *  - any other extension is attempted to be loaded as yaml and
     *    if that fails, json is tried
     * 
     * throws KubeconfigError if file:
     *  - could not be read
     *  - could not be parsed
     *  - has invalid structure
     */
    static async fromFile(path: string): Promise<Kubeconfig> {
        const path_lower = path.toLowerCase();

        let contents;
        try {
            contents = await readFile(path, { encoding: "utf8" });
        } catch (e) {
            throw new KubeconfigError(`Could not read kubeconfig file`, e);
        }
        if (path_lower.endsWith(".json")) {
            return Kubeconfig.fromJson(contents);
        }
        if (path_lower.endsWith(".yaml")) {
            return Kubeconfig.fromYaml(contents);
        }
        // ¯\_(ツ)_/¯
        return Kubeconfig.fromYamlOrJson(contents);
    }

    static async default(): Promise<Kubeconfig> {
        if (process.env.KUBECONFIG !== undefined) {
            return Kubeconfig.fromFile(process.env.KUBECONFIG);
        }
        return Kubeconfig.fromFile(join(homedir(), ".kube", "config"));
    }

    clusters: Cluster[];
    users: User[];
    contexts: Context[];
    current_context: string;

    private constructor(obj: KubeconfigStruct) {
        ["users", "clusters", "contexts"].forEach((section) => {
            if (!Array.isArray((obj as any)[section])) {
                throw new KubeconfigError(`"${section}" is not an array`);
            }
        });
        this.users = obj.users.map((user) => {
            return new User(user.name,
                base64decode(user.user["client-certificate-data"]),
                base64decode(user.user["client-key-data"]),
            );
        });
        this.clusters = obj.clusters.map((cluster) => {
            return new Cluster(cluster.name,
                cluster.cluster.server,
                base64decode(cluster.cluster["certificate-authority-data"]),
            );
        });
        this.contexts = obj.contexts.map((context) => {
            return new Context(context.name,
                context.context.cluster,
                context.context.user,
            );
        });
        this.current_context = obj["current-context"];
    }

    get_current_context(): Context | undefined {
        return this.contexts.find((context) => context.name === this.current_context);
    }
    get_cluster(name: string): Cluster | undefined {
        return this.clusters.find((cluster) => cluster.name === name);
    }
    get_user(name: string): User | undefined {
        return this.users.find((user) => user.name === name);
    }
    get_current(): [Cluster, User] {
        const cc = this.get_current_context();
        if (!cc) {
            throw new KubeconfigError(`Unable to determine current "context"`);
        }
        const cluster = this.get_cluster(cc.cluster);
        if (!cluster) {
            throw new KubeconfigError(`Unable to determine current "cluster"`);
        }
        const user = this.get_user(cc.user);
        if (!user) {
            throw new KubeconfigError(`Unable to determine current "user"`);
        }
        return [cluster, user];
    }
}
