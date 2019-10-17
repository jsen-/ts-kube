import { K8sObject } from "../../lib";

type StringConfigMap = {
    data: Record<string, string | boolean | number>;
};
type BinaryConfigMap = {
    binaryData: Record<string, Uint8Array>;
};

type DistinctKeys<T extends StringConfigMap & BinaryConfigMap>
    = Extract<keyof T["data"], keyof T["binaryData"]> extends never
    ? T
    : never;

export function ConfigMap<T>(
    name: string,
    spec: Exact<K8sObject<StringConfigMap>, T>
        | Exact<K8sObject<BinaryConfigMap>, T>
        | DistinctKeys<Exact<K8sObject<StringConfigMap & BinaryConfigMap>, T>>
) {
    return Object.assign({ apiVersion: "v1", kind: "ConfigMap" }, { metadata: { name } }, spec);
}

type ExactKeys<T, Shape> = Exclude<keyof T, keyof Shape> extends never
    ? T
    : never;

type Exact<Shape, T> = T extends Shape
    ? ExactKeys<T, Shape>
    : never;