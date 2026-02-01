import crypto from 'crypto';

const pkcs1Header = '-----BEGIN RSA PRIVATE KEY-----';
const pkcs1Footer = '-----END RSA PRIVATE KEY-----';

const rawKey = `MIIEpAIBAAKCAQEAqh4BUoloSFxy05gfDHEYvG4s2yPJbDGu0uk9kd1CDs4asLep
RT08cLeZkDbIye53prVKtVL3929kKse+tZ41/PdsWd/ub63MMrdmRFQyOAOFyWmg
Lh4T1PnlG89jvfxyVASlPCWvmkNqUQlt6gH/L7nTfFc+7ZpxQ6nHPbsoolwqPSCj
N/FGq5r/3FqS5lasHySrHNgV6Cn9c0dptDCMeiOhfrJmZSfyInnsyW/FPcEwh+wo
MmuhMTZ/zablfo//iGLM+VGM2iHOCt9QBCMFELU7Tm91k/Pjpn9XN7mdPAaHCySW
gwVEwnH7X1Kd2vurMZxLcEGDIXM/dw9G2dvWbwIDAQABAoIBAHMEcnRxftZd2y0A
zw1EcisEesN3QLosJT1ogT5b0EveQeF1a7bqnjC/kc4VnFAbMT6/mFFcVVcwMxNR
lbmJzIrKZrGlW7qaUVOA+F3+Zy3EA/KXvbswjswSYTsaTx+mzU3NDkLKYB32sq0z
qOLskrKb+0c4Xc2b/DR5V8J/BgwvFdFmc29Pik4m8P/PVpYVLpH+5mr0H5JL3QDB
ekeZ7pjHzP79tuo6801Nhwje9bbUi6YWiUBZ4hoD/AGeSmH2pATx59O+absRez4g
L+3g/xopBECOydakBzJjN7WccxKdST7xx0D9SrwPbS2Cem/RCX1NTDIlqUu/WdR0
ouKYvMECgYEA2gP+IovvDIgS9nOFQtY7NQi40wMlhBRxLRafnPIzYwC4hBmPrKKz
PpzZ3Z5A9Am+LjXOC/OEUFVj3rpGqTkMd0E88dMoHQ4OQ/JXMq02MMlQTSkzvutZ
OZBj01qrptodBb9suh3VQkNReJ3gIVqWmPWNrF8skd1HhzNs8D46Gd8CgYEAx8Gh
w5l99bNZRGeeN2hyPTasmIC08mmXyz1QzuOivkxIUAY4GlMc9KTsPTZ+xitd/XDg
NtoFs+iIYH9SEa2y61dHbic5OUui0a5YT7r2agY/KpGZ5UlA4iMU0ApfRUvxr9CP
QXNQ63udBREnv8u/aXAYmJ9NDngVXQcDn48M9XECgYBPjx1ypfY6cH3bChUbaup4
VBJ+jqtmI7+ZYKQmtgwimOS88EcKDOW0d7DZuyKg691HJ8NlgRxL5J1pbjjTEEqI
SnpfFVuSHsr96LYBfExGSXDQd7S2e1Q4OYT0YCY74WSt8ElRMgndAIv+D5ibZh/
gTyOJr0xDbtIj2+1zD+PqQKBgQCFJghRfOp88AM8mWTYwgID04HQVVpHiyLnEgPf
I9TCy84XqU2UHnpah+QAGWb/aMDJwodxiHnspb7hs3xc1E9Cl3bBcduu2T+6TGAJ
JTJDEc7g7RSLxPw+v+uLkJ5Ybnq3Gmmi0t7JWCgdzIWWTpVUDqgWc3jFgD2dOKOt
o4ibwQKBgQCKjsrxioOweG3J2RGjFB+jxbpQCwqxWLkutBB/m72nMCzr1dHtRNGK
YhXMsh4UH5DOrE55tJRegrge7sjSEVsfRprthkUdF9tQUQR23ceA4f63rRVhtlOl
coW9xfP7SX8bKwnIRNOr8Lf4zVZCzxhw/zhrDKF55w6o/zK4tMZ2OA==`;

const pem = `${pkcs1Header}\n${rawKey}\n${pkcs1Footer}`;

try {
    const key = crypto.createPrivateKey({
        key: pem,
        format: 'pem',
        type: 'pkcs1'
    });

    const pkcs8 = key.export({
        format: 'pem',
        type: 'pkcs8'
    });

    process.stdout.write(pkcs8);
} catch (e) {
    process.stderr.write(e.stack);
    process.exit(1);
}
