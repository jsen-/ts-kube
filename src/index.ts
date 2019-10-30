import core from "./core";
export { Base64 } from "./util/base64";
import { Api } from "./http/";

import { inspect } from "util";
export const k8s = {
    core
};

const CA = `-----BEGIN CERTIFICATE-----
MIICyDCCAbCgAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl
cm5ldGVzMB4XDTE5MTAyOTIwMjQyOVoXDTI5MTAyNjIwMjQyOVowFTETMBEGA1UE
AxMKa3ViZXJuZXRlczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOKH
s27rqn126h1IiJWejqVRIGoMX2dgeGFcIkZ4wP0Sj/NC3Nrz0S5HI3uqTUx6sfiW
KTTzPQk0DXfPgqW/pX/eCqeJhcCFN1Q+s//zuxYFnFhQZUonZ891LhkZTOcxK+2g
dFfIKZ/CyWUXDhBFzeZcu9+ZdwEJHC759ARxlZpl39Cp1IHF4VUN3ZVb45XsSEzs
aPFVJxgJ/uvlkv+YVdE46YuG9BcX74SyJ2tDSGGNC8nxlhoYhIpEvaTtNFGHBdBx
x4my3XWYrJbRSZpQJ2BiiVNtzM29mZiuhhcoFO18pLQrv3iGm7VnAfZlKvsup/c4
Gl03j7ItnrM3s9LfB+MCAwEAAaMjMCEwDgYDVR0PAQH/BAQDAgKkMA8GA1UdEwEB
/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBANzTIObiwabHFd3Tl8Sv1FHyjjEu
Etn6wPH5z3vfyObhUp0H980KBPNk3Xjo6wTkT49UDKJM7Rbn7rzZHclklSISvABN
9yF3zbnwEuJVaYqLtM1EAp3fBC8T2OEs2irq6bb9h+yKuUq36JXiT+oxNEU7J7vR
7KMYy4b6R6SDYt9YJRL31pY3APf2A3scbWCoRQkxHl0Qekg6jU6RiWRot8Vnp59U
vXwZPTm5FNEwhIiX1Lf8EQIYYDM7DdpzcH154c8u6fOL2jcIv+N88TrnqGrRdN6Q
jwVZ973ADAkgOUiUgXUGzNW9jZoFte4YZDIg/fc7jzpxn4+V2a9oCriz4yc=
-----END CERTIFICATE-----`;

const client_cert = `-----BEGIN CERTIFICATE-----
MIIC8jCCAdqgAwIBAgIIJ0raMRKs0pQwDQYJKoZIhvcNAQELBQAwFTETMBEGA1UE
AxMKa3ViZXJuZXRlczAeFw0xOTEwMjkyMDI0MjlaFw0yMDEwMjgyMDI0MjlaMDQx
FzAVBgNVBAoTDnN5c3RlbTptYXN0ZXJzMRkwFwYDVQQDExBrdWJlcm5ldGVzLWFk
bWluMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1Z8wjCIXBzTP61Sa
+dcP+/h0xpOQ6B2e+rUZ2MAJf1JfvkQmaMZipdMWq4T2vqhilZS/R+hBmhxLYPst
2trb9AmSZmHxUAm+4OTPEcqnMuLsQd8MeGcsGChLERdkzkAxCCgQWxGtdnD+vaJI
sSadqi795ycY+9xMgkbV9cn+JXEM+gYkVr9X/ELzxD2oaHcHF/E8+iOg+vLpL7bf
ZTmmbDtLJGhq6XF5hAfnQgMp7Gs3FLVhOQUFbja4jhZ5fLq6EHMDCsnbAuR+zVDx
EMAelLPYd7d+NErDm3Jcfo2/DxO6IoNKbWjiZTccidS5EyZdAfQLjsfi2aGr+FoJ
p9u/iwIDAQABoycwJTAOBgNVHQ8BAf8EBAMCBaAwEwYDVR0lBAwwCgYIKwYBBQUH
AwIwDQYJKoZIhvcNAQELBQADggEBAEqYF8JjW8F9QUd7dtchp7Go0bgovrMKYhOz
Apai4biVdwd6/V7g7p8CEBsnUZKAdaDZksGS1nw5YRW9Lj1bEAB8eQfzHQNP6UEF
p4+au2xx/6ZYEyAaSfbFl2s2UAsjbhspwKZTmd3Ypz8mQvCQdLDp5VACVrHEmBjH
UnkD1w0hsrA5aJo6Oqg8mF6FSvOl5OVaNYWVYaAJnC2l+QyYyrlPonzZjtc9Auc2
CxlLSCgKiDhnLCQhnqqgX3hu67wNrsWoAJDwvp7f16TNf9+L0qUo7TB1aC7aOf3r
jE1sZPzjCIx7GY5XXgAJqO/mr2Ryq8fVZlYOOC8qt/mvXZdqNA0=
-----END CERTIFICATE-----`;

const client_key = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1Z8wjCIXBzTP61Sa+dcP+/h0xpOQ6B2e+rUZ2MAJf1JfvkQm
aMZipdMWq4T2vqhilZS/R+hBmhxLYPst2trb9AmSZmHxUAm+4OTPEcqnMuLsQd8M
eGcsGChLERdkzkAxCCgQWxGtdnD+vaJIsSadqi795ycY+9xMgkbV9cn+JXEM+gYk
Vr9X/ELzxD2oaHcHF/E8+iOg+vLpL7bfZTmmbDtLJGhq6XF5hAfnQgMp7Gs3FLVh
OQUFbja4jhZ5fLq6EHMDCsnbAuR+zVDxEMAelLPYd7d+NErDm3Jcfo2/DxO6IoNK
bWjiZTccidS5EyZdAfQLjsfi2aGr+FoJp9u/iwIDAQABAoIBABp24TXLF10+Lq/x
yE1BVmqZyiW7rE0FNmfKvcv7ZnHOi6vvl26NfTUb5IgVLdhK1gO/7L6EyHPGI5R9
KZ4eVPdzpB5o7dNDkdEcp4aFu5bzQ9+ZOVtFNNI9U6dnZYajry9af0Q4+Wtd7kEh
9K11ojyuG6hiUJcLILNXATS09HZAxC6ssIJo9tf9s4XsSTAedOSMcElk6XFXzkn+
GdzgALyZ7ZHH1PeKbjr2EKLVztYALwKp8PmBHOtvm4S3BNWQUSml40l5YWd555oK
ok/BJVofsqcmMwIePTKr4qGWHABI0P32FpWyl8/mQW6byO7bdZGvscYG5wbL4J0u
wQzjLZkCgYEA5iVNgJQaB/B/ykqAfbIbNnJl9z7y2tH73qshcXCGjkmhS5LV0gj/
Dfxa2efv/dd62qsqgbAdCnYQVqPIMrNfHRxRe3h5EBUWSv6JhQ86Q85ZF5vS3gxn
TA5ATFVHOePJi2IRl2UDRON5wKAMX5EPg7LtbtvKd005n4U8/idAw4cCgYEA7Z6u
YuXh6D9UcMdn3z72SO/qR8k3LhP9M4O4Vr/z1vELoW0kRzs2TDUWSKIb8rukf0JB
o1wQ/SCuoRfZ4NwtVZGQRLbm6l6tN/CixZK9eMywzvVHuPXviIywPZUenW9/PZQL
xiW3E0JsYIVhkrd1dbqyIElnJExGhKzl6+NabN0CgYBj9Al/8VKI5jOp+MdrT+Iv
uGl+gzFYReB86ZgBu5xEyceqmeARc2TKfzI591isx1wNAk/YuVMziuk3p7Q4CN0j
OHxPApiZmn7vHTM+vclRT5oz/bIMTBjE2F+mh1cC1mJfDb2UIgPUdHMZbKlTDB5P
1XL3Na/uNnTzShueSg//mwKBgQDhtKd6g1eJDpa7pX1x3dF8yH7l/ygt2YjZ5NU1
eZE5aq8cf5pFGuZhjs+C4JDhiQEgbCQC8tGkTuXxWMF5SEq7i8/YpU9D8fhhOW6z
csYMt4l+nBerhdgoAVLqu/lfm+fl6vkgFvUGE0L0j911ylOFJ3hJGNAi91zIa57d
6JAc9QKBgQCZEbSY0k0AEG0kW5LsoBfrVOsYGy9oNv+qsJ30gRldUgcuNBrF/m06
tm65B4YhgSccBsH/LavOl/6o+KJSxeSKK0USGz/cep6YiqPpR2vKLXg23EHoewLL
HvcgK9w0Z5VloFp/h51U4di4V60HGuydlCyz35L662ktYEVnqdvz1w==
-----END RSA PRIVATE KEY-----`;

async function main() {
    const api = Api.new({
        server_root: "https://localhost:35411",
        cacert: CA,
        client_cert,
        client_key,
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