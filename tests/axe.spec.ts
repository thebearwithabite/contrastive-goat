import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes=['/','/predict','/feelings','/goat'];
for(const r of routes){test(`a11y ${r}`, async ({ page }) => {await page.goto('http://localhost:4173'+r);const results=await new AxeBuilder({page}).analyze();const critical=results.violations.filter(v=>v.impact==='critical');if(critical.length)console.error(JSON.stringify(critical,null,2));expect(critical.length,`Critical a11y violations on ${r}`).toBe(0);});}
