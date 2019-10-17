type Exact<A extends object, B extends A> = A & Record<Exclude<keyof B, keyof A>, never>

export interface Metadata {
    metadata?: {
        namespace?: string;
    }
};
export type K8sObject<T> = Metadata & T;

export type K8sType = {
    apiVersion: string,
    kind: string,
};
export type K8sDecl<K extends K8sType, T> = K & { metadata: { name: string } } & T;

export function wrap<T, K extends Exact<K8sType, K>>(ktype: K) {
    return function <M extends Exact<K8sObject<T>, M>>(name: string, spec: M): K8sDecl<K, M> {
        return Object.assign({}, ktype, { metadata: { name } }, spec) as any;
    };
}
