import crypto from 'crypto';
import fs from 'fs';

const tfvars = fs.readFileSync('terraform/environments/production/terraform.tfvars', 'utf8');
const match = tfvars.match(/github_app_private_key\s*=\s*<<-EOF\s*\n([\s\S]*?)\n\s*EOF/);

if (!match) {
    console.error("Could not find github_app_private_key in terraform.tfvars");
    process.exit(1);
}

const pem = match[1].trim();

try {
    const key = crypto.createPrivateKey({
        key: pem,
        format: 'pem'
    });

    const pkcs8 = key.export({
        format: 'pem',
        type: 'pkcs8'
    });

    process.stdout.write(pkcs8);
} catch (e) {
    console.error(e.stack);
    process.exit(1);
}
