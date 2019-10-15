import { K8sObject, Exact } from "../../lib";

type StringConfigMap = {
    data: Record<string, string | boolean | number>;
};
type BinaryConfigMap = {
    binaryData: Record<string, Uint8Array>;
};

type ConfigMap = StringConfigMap & BinaryConfigMap;

type DistinctKeys<T>
    = T extends StringConfigMap
        ? T extends BinaryConfigMap
            ? Extract<keyof T["data"], keyof T["binaryData"]> extends never
                ? T
                : never
            : K8sObject<StringConfigMap | BinaryConfigMap>
        : T extends BinaryConfigMap
            ? K8sObject<BinaryConfigMap>
            : never;

export function ConfigMap<M extends Exact<K8sObject<ConfigMap>, M>>(name: string, spec: DistinctKeys<M>) {
    return Object.assign({ apiVersion: "v1", kind: "ConfigMap" }, { metadata: { name } }, spec);
}
