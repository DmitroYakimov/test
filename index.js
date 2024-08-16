const fs = require('fs');

const users = JSON.parse(fs.readFileSync('users.json'));
const sampleData = JSON.parse(fs.readFileSync('sample_data.json'));

const recognized = [];
const notRecognized = [];

function getEmailParts(email) {
    return email.split('@')[0].split(/[.\-_]/).filter(Boolean);
}

sampleData.forEach(entry => {
    const sampleEmail = entry.account_email || entry.email;
    if (!sampleEmail) return;

    let isRecognized = false;

    users.forEach(user => {
        const userEmailParts = getEmailParts(user.email);
        const regexPatterns = userEmailParts.map(part => new RegExp(part, 'i'));

        if (regexPatterns.some(regex => regex.test(sampleEmail))) {
            const existingUser = recognized.find(item => item.user_email === user.email);
            if (existingUser) {
                existingUser.related_emails.push(sampleEmail);
            } else {
                recognized.push({
                    user_email: user.email,
                    related_emails: [sampleEmail]
                });
            }
            isRecognized = true;
        }
    });

    if (!isRecognized) {
        notRecognized.push(sampleEmail);
    }
});

const output = {
    recognized: recognized,
    not_recognized: notRecognized
};

fs.writeFileSync('output.json', JSON.stringify(output, null, 2));

console.log('Обробка завершена. Перевірте файл output.json.');