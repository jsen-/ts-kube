function isObject(val: any): val is Object {
    return typeof val === "object" && val !== null;
}

function objectAssignDeep<T extends object, U extends object>(target: T, source: U): T & U {
    const t: any = target;
    const s: any = source;

    Object.entries(s).forEach(([key, value]) => {
        if (key in target) {
            if (isObject(value)) {
                if (isObject(t[key])) {
                    objectAssignDeep(value, t[key])
                } else {
                    throw new Error(`Cannot merge ${typeof value} into ${typeof t[key]}`);
                }
            } else {
                throw new Error(`Refusing to overwrite ${typeof t[key]} with ${typeof value}`);
            }
        } else {
            t[key] = value;
        }
    });
    return t;
}

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
        const x = objectAssignDeep({}, ktype);
        const y = objectAssignDeep(x, { metadata: { name } })
        const z = objectAssignDeep(y, spec);
        return z;
    };
}
