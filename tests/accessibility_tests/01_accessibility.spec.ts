import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://sdetqa.vercel.app/accessibility_test_app');
    });

    // 1. Basic accessibility scan using AxeBuilder
    test('Basic accessibility scan', async ({ page }) => {

        const results = await new AxeBuilder({ page }).analyze();

        console.log(results.violations);

        // expect(results.violations).toEqual([]); // fail if there are any accessibility violations

    });

    // 2. Print accessibility violations in a readable format
    test('Print accessibility violations', async ({ page }) => {

        const results = await new AxeBuilder({ page }).analyze();

        // approach 1
        console.log("Total Violations: ", results.violations.length);

        for (const violation of results.violations) {
            console.log(`\nRule: ${violation.id}`);
            console.log(`Impact: ${violation.impact}`);
            console.log(`Description: ${violation.description}`);
        }

        // approach 2
        /* if (results.violations.length > 0) {
            console.log("Total Violations: ", results.violations.length);
            console.log('Accessibility Violations:');
            results.violations.forEach((violation) => {
                console.log(`\nRule: ${violation.id} \nImpact: ${violation.impact} \nDescription: ${violation.description}`);
                // violation.nodes.forEach((node) => {
                //     console.log(`  - Element: ${node.target.join(', ')}`);
                //     console.log(`    Failure Summary: ${node.failureSummary}`);
                // });
            });
        } else {
            console.log('No accessibility violations found.');
        } */
    });

    // 3. Scan a Specific Section of the Page - using include method
    test('Scan a Specific Section of the Page', async ({ page }) => {

        const results = await new AxeBuilder({ page })
            .include('#main-content') // Specify the section to scan
            .analyze();

        console.log(results.violations.length);

        for (const violation of results.violations) {
            console.log(`\nRule: ${violation.id}`);
            console.log(`Impact: ${violation.impact}`);
            console.log(`Description: ${violation.description}`);
        }

        // expect(results.violations).toEqual([]); // fail if there are any accessibility violations

    });

    // 4. Exclude a Specific Section of the Page - using exclude method
    test('Excude the specific section from the test', async ({ page }) => {

        const results = await new AxeBuilder({ page })
            .exclude('footer')
            .analyze();

        console.log(results.violations.length)

        if (results.violations.length > 0) {

            results.violations.forEach((violation) => {
                console.log(`\nRule: ${violation.id} \nImpact: ${violation.impact} \nDescription: ${violation.description}`);

            });
        };
    });

    // 5. Scan for Specific WCAG Standards
    test('Scan WCAG 2.0 A, AA and 2.1 A, AA Rules', async ({ page }) => {

        // await page.goto('https://www.ksrtc.in/');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        console.log(accessibilityScanResults.violations);

        // expect(accessibilityScanResults.violations).toEqual([]);


    });

    // 6. Disable Individual Scan Rules
    test('Disable individual accessibility rules', async({ page }) => {

        const results = await new AxeBuilder({ page })
            .disableRules([
                'color-contrast',
                'link-name'
            ])
            .analyze()

            console.log(results.violations);
    });

    // 7. Export Scan Results as Test Attachment
    test('Export Scan Results as Test Attachment', async ({ page }, testInfo) => {

        const results = await new AxeBuilder({ page }).analyze();

        // console.log(results.violations); 
        
        // Export the results as a JSON file
        await testInfo.attach('accessibility-scan-results', {
            body: JSON.stringify(results, null, 2), // purpose of null, 2 is to format the JSON with indentation for better readability
            contentType: 'application/json',
        }); 

        console.log('Accessibility scan results exported as test attachment.');
    });
});