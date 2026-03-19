// Saurellius Knowledge Base — Payroll Articles, Tips & Tricks, Help
export const CATEGORIES = [
  { id: "all", label: "All Articles", icon: "grid" },
  { id: "state-taxes", label: "State Tax Guides", icon: "map" },
  { id: "payroll-basics", label: "Payroll Basics", icon: "book" },
  { id: "tips", label: "Tips & Tricks", icon: "zap" },
  { id: "compliance", label: "Compliance & Law", icon: "shield" },
  { id: "deductions", label: "Deductions & Benefits", icon: "calculator" },
  { id: "help", label: "Help & FAQ", icon: "help" },
];

export const ARTICLES = [
  // ── PAYROLL BASICS ────────────────────────────────────────
  {
    id: "what-is-a-paystub",
    category: "payroll-basics",
    title: "What Is a Pay Stub? Complete Guide",
    summary: "Everything about pay stubs — what they include and why they matter for employees and employers.",
    readTime: "5 min",
    content: `<h2>What Is a Pay Stub?</h2>
<p>A <strong>pay stub</strong> (also called a paycheck stub, wage statement, or earnings statement) is a document accompanying a paycheck that details how an employee's pay was calculated.</p>

<h3>What's Included on a Pay Stub</h3>
<ul>
<li><strong>Gross Pay</strong> — Total earnings before deductions</li>
<li><strong>Net Pay</strong> — Take-home pay after all deductions</li>
<li><strong>Federal Income Tax</strong> — Withheld based on W-4 elections</li>
<li><strong>State Income Tax</strong> — Varies by state (9 states have none)</li>
<li><strong>Social Security (FICA)</strong> — 6.2% up to $168,600 wage base</li>
<li><strong>Medicare</strong> — 1.45% on all wages; additional 0.9% for high earners</li>
<li><strong>Deductions</strong> — Health insurance, 401(k), garnishments</li>
<li><strong>YTD Totals</strong> — Year-to-date cumulative figures</li>
<li><strong>Pay Period</strong> — Start and end dates</li>
<li><strong>Hours Worked</strong> — Regular and overtime (hourly employees)</li>
</ul>

<h3>Why Pay Stubs Matter</h3>
<ol>
<li><strong>Proof of Income</strong> — Required for loans, mortgages, and rental applications</li>
<li><strong>Tax Accuracy</strong> — Verify W-2 figures at year end</li>
<li><strong>Budgeting</strong> — Track earnings and deductions over time</li>
<li><strong>Employment Verification</strong> — Confirm job and salary details</li>
<li><strong>Legal Protection</strong> — Evidence in wage disputes</li>
</ol>

<h3>Are Pay Stubs Required by Law?</h3>
<p>There is <strong>no federal law</strong> requiring employers to provide pay stubs. However, most states have their own requirements. States like California, New York, and Texas require employers to provide detailed wage statements.</p>

<h3>How Long Should You Keep Pay Stubs?</h3>
<p>Keep pay stubs for at least <strong>one year</strong> for tax purposes. After filing your tax return, keep them until you've verified the information matches your W-2. For major financial transactions (mortgage applications), keep at least 2-3 recent pay stubs on hand.</p>`
  },
  {
    id: "gross-vs-net-pay",
    category: "payroll-basics",
    title: "Gross Pay vs. Net Pay: What's the Difference?",
    summary: "Understand the critical difference between your total earnings and your take-home pay.",
    readTime: "4 min",
    content: `<h2>Gross Pay vs. Net Pay</h2>
<p>Understanding the difference between gross and net pay is fundamental to managing your finances.</p>

<h3>Gross Pay</h3>
<p><strong>Gross pay</strong> is your total compensation before any deductions. For hourly workers, it's hours worked × hourly rate. For salaried employees, it's your annual salary divided by pay periods.</p>
<p><em>Example:</em> If you earn $25/hour and work 80 hours in a bi-weekly period, your gross pay is $2,000.</p>

<h3>Net Pay</h3>
<p><strong>Net pay</strong> (take-home pay) is what you actually receive after all deductions are subtracted from gross pay.</p>

<h3>Common Deductions</h3>
<table>
<tr><th>Deduction</th><th>Rate</th><th>Who Pays</th></tr>
<tr><td>Federal Income Tax</td><td>10%–37%</td><td>Employee</td></tr>
<tr><td>Social Security</td><td>6.2%</td><td>Both (12.4% total)</td></tr>
<tr><td>Medicare</td><td>1.45%</td><td>Both (2.9% total)</td></tr>
<tr><td>State Income Tax</td><td>0%–13.3%</td><td>Employee</td></tr>
<tr><td>Health Insurance</td><td>Varies</td><td>Often shared</td></tr>
<tr><td>401(k)/Retirement</td><td>Varies</td><td>Employee (often matched)</td></tr>
</table>

<h3>Quick Formula</h3>
<p><strong>Net Pay = Gross Pay − Federal Tax − State Tax − FICA − Medicare − Other Deductions</strong></p>
<p>Typically, deductions consume 25%–35% of gross pay for most workers.</p>`
  },
  {
    id: "understanding-w4",
    category: "payroll-basics",
    title: "Understanding Your W-4 Form",
    summary: "How to fill out your W-4 correctly to avoid owing taxes or over-withholding.",
    readTime: "6 min",
    content: `<h2>The W-4 Form Explained</h2>
<p>The <strong>Form W-4</strong> (Employee's Withholding Certificate) tells your employer how much federal income tax to withhold from your paycheck.</p>

<h3>Key Sections</h3>
<ul>
<li><strong>Step 1</strong> — Personal information and filing status (Single, Married Filing Jointly, Head of Household)</li>
<li><strong>Step 2</strong> — Multiple jobs or spouse works (use IRS worksheet or estimator)</li>
<li><strong>Step 3</strong> — Claim dependents ($2,000 per qualifying child, $500 per other dependent)</li>
<li><strong>Step 4</strong> — Other adjustments (other income, deductions, extra withholding)</li>
<li><strong>Step 5</strong> — Sign and date</li>
</ul>

<h3>Common Mistakes to Avoid</h3>
<ol>
<li><strong>Not updating after life changes</strong> — Marriage, divorce, new child, new job</li>
<li><strong>Claiming too many allowances</strong> — Results in owing taxes at filing time</li>
<li><strong>Ignoring Step 2</strong> — If both spouses work, you may underwithhold</li>
<li><strong>Not accounting for side income</strong> — Freelance, investment, rental income</li>
</ol>

<h3>When to Update Your W-4</h3>
<p>Update whenever you experience a major life event: new job, marriage, divorce, birth of a child, buying a home, or significant income changes.</p>

<h3>Pro Tip</h3>
<p>Use the <strong>IRS Tax Withholding Estimator</strong> (irs.gov/W4App) to calculate the optimal withholding for your situation.</p>`
  },
  {
    id: "pay-frequency-guide",
    category: "payroll-basics",
    title: "Pay Frequency Guide: Weekly, Bi-Weekly, Semi-Monthly & Monthly",
    summary: "Compare the four most common pay schedules and understand how they affect your paycheck.",
    readTime: "4 min",
    content: `<h2>Pay Frequency Explained</h2>

<h3>The Four Pay Frequencies</h3>
<table>
<tr><th>Frequency</th><th>Pay Periods/Year</th><th>Typical Pay Day</th></tr>
<tr><td><strong>Weekly</strong></td><td>52</td><td>Every Friday</td></tr>
<tr><td><strong>Bi-Weekly</strong></td><td>26</td><td>Every other Friday</td></tr>
<tr><td><strong>Semi-Monthly</strong></td><td>24</td><td>1st and 15th</td></tr>
<tr><td><strong>Monthly</strong></td><td>12</td><td>Last day of month</td></tr>
</table>

<h3>How Pay Frequency Affects Your Check</h3>
<p>If your annual salary is $60,000:</p>
<ul>
<li><strong>Weekly:</strong> $1,153.85 gross per check</li>
<li><strong>Bi-Weekly:</strong> $2,307.69 gross per check</li>
<li><strong>Semi-Monthly:</strong> $2,500.00 gross per check</li>
<li><strong>Monthly:</strong> $5,000.00 gross per check</li>
</ul>

<h3>Which Is Most Common?</h3>
<p><strong>Bi-weekly</strong> is the most popular pay frequency in the United States, used by approximately 43% of employers. Weekly is common in construction and hourly work. Semi-monthly and monthly are common for salaried positions.</p>

<h3>State Requirements</h3>
<p>Many states mandate minimum pay frequencies. For example, California requires at least semi-monthly pay. Check your state's labor laws for specific requirements.</p>`
  },
  {
    id: "overtime-calculations",
    category: "payroll-basics",
    title: "How Overtime Pay Is Calculated",
    summary: "Federal and state overtime rules, how to calculate OT pay, and common exemptions.",
    readTime: "5 min",
    content: `<h2>Overtime Pay Calculations</h2>

<h3>Federal Rules (FLSA)</h3>
<p>The Fair Labor Standards Act requires overtime pay of <strong>1.5× regular rate</strong> for hours worked over <strong>40 in a workweek</strong>.</p>

<h3>Calculation Example</h3>
<p>Employee earns $20/hour and works 48 hours:</p>
<ul>
<li>Regular: 40 hours × $20 = $800</li>
<li>Overtime: 8 hours × $30 (1.5 × $20) = $240</li>
<li><strong>Total Gross: $1,040</strong></li>
</ul>

<h3>State Variations</h3>
<ul>
<li><strong>California:</strong> OT after 8 hours/day AND 40 hours/week. Double time after 12 hours/day</li>
<li><strong>Alaska:</strong> OT after 8 hours/day for employers with 4+ employees</li>
<li><strong>Colorado:</strong> OT after 12 hours/day or 40 hours/week</li>
<li><strong>Nevada:</strong> OT after 8 hours/day if employee earns less than 1.5× minimum wage</li>
</ul>

<h3>Exempt vs. Non-Exempt</h3>
<p><strong>Exempt employees</strong> (typically salaried, earning $43,888+/year, performing executive/administrative/professional duties) are NOT entitled to overtime pay.</p>
<p><strong>Non-exempt employees</strong> MUST receive overtime pay regardless of whether they are paid hourly or salary.</p>`
  },
  {
    id: "understanding-fica",
    category: "payroll-basics",
    title: "FICA Taxes Explained: Social Security & Medicare",
    summary: "How FICA taxes work, current rates, wage bases, and what self-employed individuals need to know.",
    readTime: "5 min",
    content: `<h2>FICA Taxes: Social Security & Medicare</h2>
<p>FICA (Federal Insurance Contributions Act) taxes fund Social Security and Medicare programs.</p>

<h3>Current Rates (2025)</h3>
<table>
<tr><th>Tax</th><th>Employee</th><th>Employer</th><th>Total</th><th>Wage Base</th></tr>
<tr><td>Social Security</td><td>6.2%</td><td>6.2%</td><td>12.4%</td><td>$168,600</td></tr>
<tr><td>Medicare</td><td>1.45%</td><td>1.45%</td><td>2.9%</td><td>No limit</td></tr>
<tr><td>Additional Medicare</td><td>0.9%</td><td>—</td><td>0.9%</td><td>>$200K individual</td></tr>
</table>

<h3>Key Points</h3>
<ul>
<li>Social Security tax stops once you earn above the wage base ($168,600 in 2025)</li>
<li>Medicare has NO wage base limit — all earnings are taxed</li>
<li>Additional Medicare Tax of 0.9% applies to earnings over $200,000 (single) or $250,000 (married)</li>
<li>Self-employed individuals pay BOTH halves (15.3% total) as "self-employment tax"</li>
<li>Self-employed can deduct the employer-equivalent portion (7.65%) on their tax return</li>
</ul>`
  },

  // ── TIPS & TRICKS ─────────────────────────────────────────
  {
    id: "maximize-take-home",
    category: "tips",
    title: "10 Ways to Maximize Your Take-Home Pay",
    summary: "Legal strategies to keep more of your hard-earned money in every paycheck.",
    readTime: "6 min",
    content: `<h2>Maximize Your Take-Home Pay</h2>

<h3>1. Optimize Your W-4</h3>
<p>Use the IRS withholding estimator to ensure you're not over-withholding. Getting a big tax refund means you gave the government an interest-free loan.</p>

<h3>2. Maximize Pre-Tax Contributions</h3>
<p>401(k) contributions reduce taxable income. In 2025, you can contribute up to $23,500 ($31,000 if 50+).</p>

<h3>3. Use an HSA</h3>
<p>Health Savings Accounts offer triple tax benefits: tax-deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses. 2025 limits: $4,300 individual / $8,550 family.</p>

<h3>4. Leverage FSAs</h3>
<p>Flexible Spending Accounts for healthcare ($3,300) and dependent care ($5,000) reduce taxable income.</p>

<h3>5. Commuter Benefits</h3>
<p>Pre-tax transit and parking benefits up to $325/month each (2025).</p>

<h3>6. Review Your Benefits Annually</h3>
<p>During open enrollment, compare health plan costs. A higher-deductible plan with HSA may save more than a low-deductible plan.</p>

<h3>7. Negotiate Your Salary</h3>
<p>A $5,000 raise translates to roughly $150-200 more per paycheck (after taxes).</p>

<h3>8. Consider State Tax Impact</h3>
<p>If you're remote, working from a no-income-tax state (FL, TX, WA, NV, etc.) can save 5-13% of your income.</p>

<h3>9. Avoid Unnecessary Garnishments</h3>
<p>Stay current on child support, student loans, and tax obligations to prevent wage garnishment.</p>

<h3>10. Track and Verify Every Stub</h3>
<p>Errors happen. Review each pay stub for accuracy in hours, rate, and deductions. Report discrepancies immediately.</p>`
  },
  {
    id: "common-paystub-errors",
    category: "tips",
    title: "Common Pay Stub Errors and How to Spot Them",
    summary: "The most frequent payroll mistakes and how to identify and resolve them quickly.",
    readTime: "4 min",
    content: `<h2>Common Pay Stub Errors</h2>

<h3>Top Errors to Watch For</h3>
<ol>
<li><strong>Incorrect Hours</strong> — Verify against your own records. Even 15 minutes per day adds up to $1,000+/year at $20/hr</li>
<li><strong>Wrong Tax Rate</strong> — Especially after moving states or updating W-4</li>
<li><strong>Missing Overtime</strong> — Ensure all hours over 40 (or 8/day in CA) are at 1.5× rate</li>
<li><strong>Incorrect Deductions</strong> — Insurance premiums or retirement contributions that don't match your elections</li>
<li><strong>Classification Error</strong> — Being classified as exempt when you should be non-exempt (affects OT eligibility)</li>
<li><strong>YTD Discrepancies</strong> — Running totals that don't add up from previous stubs</li>
<li><strong>Wrong Pay Rate</strong> — After a raise, verify the new rate appears on the next stub</li>
</ol>

<h3>What to Do If You Find an Error</h3>
<ol>
<li>Document the discrepancy with specific amounts and dates</li>
<li>Notify your HR or payroll department in writing</li>
<li>Keep copies of all related pay stubs</li>
<li>If unresolved, file a complaint with your state labor department</li>
<li>For federal violations, contact the Department of Labor's Wage and Hour Division</li>
</ol>`
  },
  {
    id: "reading-your-paystub",
    category: "tips",
    title: "How to Read Your Pay Stub Like a Pro",
    summary: "A line-by-line breakdown of every section on your pay stub and what each number means.",
    readTime: "5 min",
    content: `<h2>Reading Your Pay Stub</h2>

<h3>Header Section</h3>
<ul>
<li><strong>Employer Info</strong> — Company name, address, EIN (Employer Identification Number)</li>
<li><strong>Employee Info</strong> — Your name, address, SSN (usually masked as XXX-XX-1234)</li>
<li><strong>Pay Period</strong> — Start date and end date of the period covered</li>
<li><strong>Pay Date</strong> — When you receive the payment</li>
</ul>

<h3>Earnings Section</h3>
<ul>
<li><strong>Regular</strong> — Base pay (hours × rate or salary portion)</li>
<li><strong>Overtime</strong> — Hours beyond 40/week at premium rate</li>
<li><strong>Holiday/PTO</strong> — Paid time off if used during this period</li>
<li><strong>Bonus/Commission</strong> — Any supplemental wages</li>
</ul>

<h3>Deductions Section</h3>
<ul>
<li><strong>Federal Withholding</strong> — Based on W-4, filing status, and income level</li>
<li><strong>State Withholding</strong> — Based on state tax tables and your elections</li>
<li><strong>Social Security</strong> — 6.2% of gross (up to wage base)</li>
<li><strong>Medicare</strong> — 1.45% of all gross wages</li>
<li><strong>Pre-Tax Deductions</strong> — 401(k), HSA, FSA, health insurance premiums</li>
<li><strong>Post-Tax Deductions</strong> — Roth 401(k), garnishments, union dues</li>
</ul>

<h3>Summary Section</h3>
<ul>
<li><strong>Current Period</strong> — Earnings and deductions for this check</li>
<li><strong>YTD (Year-to-Date)</strong> — Cumulative totals since January 1</li>
<li><strong>Net Pay</strong> — Your actual take-home amount</li>
</ul>`
  },
  {
    id: "self-employed-paystubs",
    category: "tips",
    title: "Pay Stubs for Self-Employed & Freelancers",
    summary: "How to create professional pay stubs when you're your own boss.",
    readTime: "4 min",
    content: `<h2>Self-Employed Pay Stubs</h2>
<p>Self-employed individuals, freelancers, and independent contractors don't receive traditional pay stubs from employers. But you still may need proof of income.</p>

<h3>When You Need Pay Stubs</h3>
<ul>
<li>Applying for a mortgage or loan</li>
<li>Renting an apartment</li>
<li>Applying for credit cards</li>
<li>Proving income for government programs</li>
<li>Business record-keeping</li>
</ul>

<h3>What to Include</h3>
<ul>
<li>Your business name and address</li>
<li>Pay period dates</li>
<li>Gross income for the period</li>
<li>Estimated tax withholding (federal + state + self-employment tax)</li>
<li>Business expenses and deductions</li>
<li>Net pay</li>
</ul>

<h3>Self-Employment Tax</h3>
<p>Self-employed individuals pay <strong>15.3%</strong> self-employment tax (12.4% Social Security + 2.9% Medicare) on net earnings. This is because you're paying both the employee AND employer portions.</p>
<p>You can deduct the employer-equivalent portion (7.65%) when filing your tax return.</p>

<h3>Pro Tip</h3>
<p>Use Saurellius to create professional payroll documents that are accepted by lenders, landlords, and other institutions requiring proof of income.</p>`
  },

  // ── COMPLIANCE & LAW ──────────────────────────────────────
  {
    id: "flsa-overview",
    category: "compliance",
    title: "FLSA: Fair Labor Standards Act Overview",
    summary: "Federal wage and hour laws every employer and employee should know.",
    readTime: "6 min",
    content: `<h2>Fair Labor Standards Act (FLSA)</h2>
<p>The FLSA is the primary federal law governing wages, hours, and employment standards in the United States.</p>

<h3>Key Provisions</h3>
<ul>
<li><strong>Minimum Wage:</strong> Federal minimum is $7.25/hour (many states set higher rates)</li>
<li><strong>Overtime:</strong> 1.5× regular rate for hours over 40/week</li>
<li><strong>Child Labor:</strong> Restrictions on employment of minors</li>
<li><strong>Recordkeeping:</strong> Employers must maintain accurate payroll records</li>
</ul>

<h3>Exempt vs. Non-Exempt</h3>
<p>To be <strong>exempt</strong> from overtime, an employee must meet ALL three tests:</p>
<ol>
<li><strong>Salary Basis Test:</strong> Paid a predetermined, fixed salary</li>
<li><strong>Salary Level Test:</strong> Earn at least $43,888/year ($844/week)</li>
<li><strong>Duties Test:</strong> Perform executive, administrative, professional, computer, or outside sales duties</li>
</ol>

<h3>Required Payroll Records</h3>
<p>Employers must keep for at least 3 years:</p>
<ul>
<li>Employee's full name and SSN</li>
<li>Address including zip code</li>
<li>Birth date (if under 19)</li>
<li>Sex and occupation</li>
<li>Time and day of week workweek begins</li>
<li>Hours worked each day and total each week</li>
<li>Basis of pay (hourly rate, salary, etc.)</li>
<li>Regular hourly pay rate</li>
<li>Total daily or weekly straight-time earnings</li>
<li>Total overtime for the workweek</li>
<li>All additions to or deductions from wages</li>
<li>Total wages paid each pay period</li>
<li>Date of payment and period covered</li>
</ul>`
  },
  {
    id: "paystub-laws-by-state",
    category: "compliance",
    title: "Pay Stub Laws by State: What's Required?",
    summary: "Which states require pay stubs, what they must contain, and penalties for non-compliance.",
    readTime: "5 min",
    content: `<h2>State Pay Stub Requirements</h2>

<h3>Three Categories of States</h3>

<h4>1. Access States (must provide)</h4>
<p>Employers MUST provide written or printed pay stubs: <strong>California, Colorado, Connecticut, Iowa, Maine, Massachusetts, Michigan, Minnesota, New Hampshire, New York, North Carolina, Ohio, Oregon, Pennsylvania, Rhode Island, Texas, Vermont, Virginia, Washington, Wisconsin</strong> and others.</p>

<h4>2. Access/Print States</h4>
<p>Must provide stubs but electronic access is acceptable: <strong>Alaska, Arizona, Illinois, Indiana, Maryland, Missouri, Montana, Nebraska, New Jersey, North Dakota, Oklahoma, Utah</strong> and others.</p>

<h4>3. No Requirement States</h4>
<p>Alabama, Arkansas, Florida, Georgia, Louisiana, Mississippi, Ohio, South Dakota, Tennessee — have no state law requiring pay stubs.</p>

<h3>What Must Be Included (Common Requirements)</h3>
<ul>
<li>Gross wages earned</li>
<li>Net wages paid</li>
<li>All deductions with itemization</li>
<li>Hours worked (hourly employees)</li>
<li>Pay period dates</li>
<li>Employee name or identifier</li>
<li>Employer name and address</li>
</ul>

<h3>California (Strictest Requirements)</h3>
<p>Under Labor Code §226, California pay stubs must include: gross wages, total hours worked, piece rates, all deductions, net wages, pay period dates, employee name + last 4 SSN, employer legal name + address, and all applicable hourly rates with corresponding hours.</p>

<h3>Penalties</h3>
<p>Non-compliance can result in fines of $50-$250 per violation, plus employee lawsuits and back-pay awards.</p>`
  },
  {
    id: "worker-classification",
    category: "compliance",
    title: "Employee vs. Independent Contractor: Classification Guide",
    summary: "How to properly classify workers and the tax implications of each classification.",
    readTime: "5 min",
    content: `<h2>Worker Classification</h2>
<p>Proper worker classification is critical — misclassification can result in severe penalties.</p>

<h3>IRS Three-Factor Test</h3>
<ol>
<li><strong>Behavioral Control:</strong> Does the company control how, when, and where the worker performs?</li>
<li><strong>Financial Control:</strong> Does the company control the business aspects (expenses, tools, profit opportunity)?</li>
<li><strong>Relationship Type:</strong> Written contracts, benefits, permanency of relationship?</li>
</ol>

<h3>Key Differences</h3>
<table>
<tr><th>Factor</th><th>Employee</th><th>Independent Contractor</th></tr>
<tr><td>Taxes Withheld</td><td>Yes (W-2)</td><td>No (1099)</td></tr>
<tr><td>FICA</td><td>Split 50/50</td><td>Worker pays 100%</td></tr>
<tr><td>Benefits</td><td>Often eligible</td><td>Not eligible</td></tr>
<tr><td>Tools/Equipment</td><td>Employer provides</td><td>Worker provides</td></tr>
<tr><td>Schedule</td><td>Set by employer</td><td>Set by worker</td></tr>
<tr><td>Overtime</td><td>FLSA eligible</td><td>Not applicable</td></tr>
</table>

<h3>Misclassification Penalties</h3>
<ul>
<li>Back taxes: 100% of employee share of FICA</li>
<li>Federal penalty: Up to $50 per unfiled W-2</li>
<li>IRS penalties: 1.5% of wages + 20% of employee's FICA + 100% of employer's FICA</li>
<li>State penalties vary — California can impose $5,000-$25,000 per violation</li>
</ul>`
  },

  // ── DEDUCTIONS & BENEFITS ─────────────────────────────────
  {
    id: "pretax-vs-posttax",
    category: "deductions",
    title: "Pre-Tax vs. Post-Tax Deductions Explained",
    summary: "Understand which deductions reduce your taxable income and which don't.",
    readTime: "4 min",
    content: `<h2>Pre-Tax vs. Post-Tax Deductions</h2>

<h3>Pre-Tax Deductions</h3>
<p>Reduce your taxable income BEFORE taxes are calculated. This means you pay less in income tax and FICA taxes.</p>
<ul>
<li><strong>Traditional 401(k)</strong> — Up to $23,500/year (2025)</li>
<li><strong>Health Insurance Premiums</strong> — Under Section 125 cafeteria plan</li>
<li><strong>HSA Contributions</strong> — $4,300 individual / $8,550 family (2025)</li>
<li><strong>FSA Contributions</strong> — $3,300 healthcare / $5,000 dependent care</li>
<li><strong>Commuter Benefits</strong> — $325/month transit + $325/month parking</li>
</ul>

<h3>Post-Tax Deductions</h3>
<p>Subtracted AFTER taxes are calculated. No immediate tax savings but may have other benefits.</p>
<ul>
<li><strong>Roth 401(k)</strong> — Contributions are post-tax but withdrawals are tax-free in retirement</li>
<li><strong>Life Insurance</strong> — Premiums over $50,000 group term coverage</li>
<li><strong>Disability Insurance</strong> — Some employer plans</li>
<li><strong>Wage Garnishments</strong> — Court-ordered deductions</li>
<li><strong>Union Dues</strong></li>
<li><strong>Charitable Contributions</strong> — Payroll deductions for charity</li>
</ul>

<h3>Impact Example</h3>
<p>On a $5,000 gross paycheck, a $500 pre-tax 401(k) contribution saves you approximately $125-$175 in combined taxes (depending on bracket), making the effective cost of saving $500 only about $325-$375.</p>`
  },
  {
    id: "401k-guide",
    category: "deductions",
    title: "401(k) Guide: Maximize Your Retirement Savings",
    summary: "Everything about 401(k) plans — contribution limits, employer matching, vesting, and strategies.",
    readTime: "5 min",
    content: `<h2>401(k) Retirement Plans</h2>

<h3>2025 Contribution Limits</h3>
<ul>
<li><strong>Employee:</strong> $23,500 per year</li>
<li><strong>Catch-Up (age 50+):</strong> Additional $7,500 (total $31,000)</li>
<li><strong>Total (employee + employer):</strong> $70,000</li>
</ul>

<h3>Traditional vs. Roth 401(k)</h3>
<table>
<tr><th>Feature</th><th>Traditional</th><th>Roth</th></tr>
<tr><td>Tax on Contributions</td><td>Pre-tax (reduces taxable income now)</td><td>Post-tax (no current tax break)</td></tr>
<tr><td>Tax on Withdrawals</td><td>Taxed as ordinary income</td><td>Tax-free</td></tr>
<tr><td>Best If</td><td>You expect lower tax rate in retirement</td><td>You expect higher tax rate in retirement</td></tr>
</table>

<h3>Employer Match</h3>
<p>Many employers match a percentage of your contributions. Common formulas:</p>
<ul>
<li>100% match on first 3% of salary</li>
<li>50% match on first 6% of salary</li>
<li>Dollar-for-dollar up to 4% of salary</li>
</ul>
<p><strong>Always contribute at least enough to get the full employer match — it's free money.</strong></p>

<h3>Vesting</h3>
<p>Your contributions are always 100% yours. Employer contributions may have a vesting schedule (typically 3-6 years). Common schedules:</p>
<ul>
<li><strong>Cliff vesting:</strong> 0% until year 3, then 100%</li>
<li><strong>Graded vesting:</strong> 20% per year from year 2-6</li>
</ul>`
  },
  {
    id: "health-insurance-deductions",
    category: "deductions",
    title: "Health Insurance & Payroll: How Premiums Affect Your Pay",
    summary: "How employer-sponsored health insurance premiums are deducted and the tax advantages.",
    readTime: "4 min",
    content: `<h2>Health Insurance & Payroll</h2>

<h3>Section 125 Cafeteria Plan</h3>
<p>Most employers use a Section 125 plan, which allows health insurance premiums to be deducted <strong>pre-tax</strong>. This means:</p>
<ul>
<li>Your taxable income is reduced</li>
<li>You pay less federal income tax</li>
<li>You pay less Social Security and Medicare tax</li>
<li>Your employer also saves on FICA taxes</li>
</ul>

<h3>Average Premiums (2025)</h3>
<table>
<tr><th>Coverage</th><th>Total Premium</th><th>Employee Share</th><th>Employer Share</th></tr>
<tr><td>Individual</td><td>$8,951/year</td><td>$1,436/year</td><td>$7,515/year</td></tr>
<tr><td>Family</td><td>$25,572/year</td><td>$6,575/year</td><td>$18,997/year</td></tr>
</table>

<h3>Types of Plans</h3>
<ul>
<li><strong>HMO</strong> — Network-restricted, lower premiums, need referrals</li>
<li><strong>PPO</strong> — Flexible network, higher premiums, no referrals needed</li>
<li><strong>HDHP</strong> — High deductible, lowest premiums, HSA-eligible</li>
<li><strong>EPO</strong> — Network-only (like HMO) but no referrals needed</li>
</ul>

<h3>HSA Strategy</h3>
<p>If you choose an HDHP, pair it with an HSA for triple tax advantages: tax-deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses. After age 65, HSA withdrawals for any purpose are taxed like a traditional IRA (no penalty).</p>`
  },

  // ── HELP & FAQ ────────────────────────────────────────────
  {
    id: "how-to-create-paystub",
    category: "help",
    title: "How to Create a Pay Stub with Saurellius",
    summary: "Step-by-step guide to creating professional, accurate payroll documents using our platform.",
    readTime: "3 min",
    content: `<h2>Creating a Pay Stub with Saurellius</h2>

<h3>Step 1: Company Information</h3>
<p>Enter your company details: name, address, city, state, ZIP code, phone number, and EIN (Employer Identification Number).</p>

<h3>Step 2: Employee Information</h3>
<p>Enter the employee's details: full name, address, SSN (securely masked), employment status (hourly or salaried), and filing status.</p>

<h3>Step 3: Pay Details</h3>
<ul>
<li>Select pay frequency (Weekly, Bi-Weekly, Semi-Monthly, Monthly)</li>
<li>Enter hourly rate or annual salary</li>
<li>Choose pay period dates</li>
<li>Add any additional earnings (bonus, commission, tips)</li>
<li>Add deductions (health insurance, 401k, garnishments)</li>
</ul>

<h3>Step 4: Review & Create</h3>
<p>Preview your pay stub, choose a professional template, and complete payment. Your pay stubs are:</p>
<ul>
<li>Created as secure PDF documents</li>
<li>Emailed to the address you specify</li>
<li>Available for immediate download</li>
<li>Stored in your dashboard for future access</li>
</ul>

<h3>Pro Tips</h3>
<ul>
<li>Double-check all calculations before submitting</li>
<li>Use consistent formatting across all pay periods</li>
<li>Keep your account active to access all your saved documents</li>
</ul>`
  },
  {
    id: "paystub-for-apartment",
    category: "help",
    title: "Using Pay Stubs for Apartment Applications",
    summary: "What landlords look for in pay stubs and how to prepare your income documentation.",
    readTime: "4 min",
    content: `<h2>Pay Stubs for Apartment Applications</h2>

<h3>What Landlords Look For</h3>
<ul>
<li><strong>Income Level:</strong> Most landlords require income of 2.5x–3x monthly rent</li>
<li><strong>Employment Stability:</strong> Consistent pay over multiple periods</li>
<li><strong>Employer Verification:</strong> Company name and contact information</li>
<li><strong>YTD Earnings:</strong> To verify annual income claims</li>
</ul>

<h3>How Many Pay Stubs Do You Need?</h3>
<p>Most landlords request <strong>2-3 recent consecutive pay stubs</strong>. Some may ask for up to 6 months of stubs for self-employed applicants.</p>

<h3>What Makes a Pay Stub Acceptable</h3>
<ul>
<li>Professional formatting with clear layout</li>
<li>Complete employer information (name, address, EIN)</li>
<li>Employee name matching your ID</li>
<li>Detailed breakdown of earnings and deductions</li>
<li>Consistent pay amounts across periods</li>
<li>Current dates (within last 30-60 days)</li>
</ul>

<h3>Additional Documentation</h3>
<p>Landlords may also request: bank statements, tax returns, employment verification letter, or a co-signer if income doesn't meet requirements.</p>`
  },
  {
    id: "paystub-for-loan",
    category: "help",
    title: "Pay Stubs for Mortgage & Loan Applications",
    summary: "How lenders use pay stubs to verify income and what you need to qualify.",
    readTime: "4 min",
    content: `<h2>Pay Stubs for Loans</h2>

<h3>Mortgage Applications</h3>
<p>Lenders typically require:</p>
<ul>
<li><strong>30 days of recent pay stubs</strong> from all income sources</li>
<li><strong>2 years of W-2s</strong> to show income history</li>
<li><strong>2 years of tax returns</strong> for self-employed applicants</li>
<li>Pay stubs showing YTD earnings consistent with stated income</li>
</ul>

<h3>What Lenders Verify</h3>
<ul>
<li>Gross monthly income (for DTI ratio calculation)</li>
<li>Employment duration and stability</li>
<li>Overtime and bonus income (usually averaged over 2 years)</li>
<li>Deductions that may affect qualifying income</li>
</ul>

<h3>Debt-to-Income (DTI) Ratio</h3>
<p>Lenders calculate DTI using your gross monthly income from pay stubs:</p>
<ul>
<li><strong>Front-End DTI:</strong> Housing costs ÷ Gross Income (max ~28%)</li>
<li><strong>Back-End DTI:</strong> All debt payments ÷ Gross Income (max ~36-43%)</li>
</ul>

<h3>Auto Loans & Personal Loans</h3>
<p>Usually require 1-2 recent pay stubs. Some lenders accept bank statements showing regular deposits as an alternative.</p>`
  },
  {
    id: "understanding-tax-withholding",
    category: "help",
    title: "Why Is So Much Tax Taken From My Paycheck?",
    summary: "Breaking down exactly where your money goes and how to adjust your withholding.",
    readTime: "5 min",
    content: `<h2>Understanding Tax Withholding</h2>
<p>It's common to be surprised by the amount deducted from your paycheck. Here's where it all goes.</p>

<h3>Breakdown for a $5,000/month Gross Pay (Single Filer)</h3>
<table>
<tr><th>Deduction</th><th>Amount</th><th>Percentage</th></tr>
<tr><td>Federal Income Tax</td><td>~$560</td><td>11.2%</td></tr>
<tr><td>Social Security</td><td>$310</td><td>6.2%</td></tr>
<tr><td>Medicare</td><td>$72.50</td><td>1.45%</td></tr>
<tr><td>State Income Tax (avg)</td><td>~$220</td><td>~4.4%</td></tr>
<tr><td>Health Insurance</td><td>~$120</td><td>~2.4%</td></tr>
<tr><td>401(k) @ 6%</td><td>$300</td><td>6%</td></tr>
<tr><td><strong>Total Deductions</strong></td><td><strong>~$1,582</strong></td><td><strong>~31.6%</strong></td></tr>
<tr><td><strong>Net Pay</strong></td><td><strong>~$3,418</strong></td><td><strong>~68.4%</strong></td></tr>
</table>

<h3>Taxes Are Not Lost Money</h3>
<ul>
<li><strong>Social Security</strong> — Funds your future retirement benefits</li>
<li><strong>Medicare</strong> — Provides health coverage at age 65+</li>
<li><strong>Federal/State Tax</strong> — Funds infrastructure, defense, education, safety net programs</li>
<li><strong>401(k)</strong> — Your own retirement savings (not a tax!)</li>
</ul>

<h3>How to Reduce Withholding (Legally)</h3>
<ol>
<li>Increase pre-tax retirement contributions</li>
<li>Open and contribute to an HSA</li>
<li>Adjust W-4 if you typically get large refunds</li>
<li>Claim all eligible deductions on W-4 Step 4(b)</li>
</ol>`
  },
  {
    id: "year-end-paystub-checklist",
    category: "help",
    title: "Year-End Pay Stub Checklist",
    summary: "Essential items to verify on your final pay stub before tax season.",
    readTime: "3 min",
    content: `<h2>Year-End Pay Stub Checklist</h2>
<p>Your last pay stub of the year should closely match your W-2. Use this checklist:</p>

<h3>Verify These Items</h3>
<ul>
<li><strong>Total Gross Wages YTD</strong> — Should match W-2 Box 1 (approximately)</li>
<li><strong>Federal Tax Withheld YTD</strong> — Must match W-2 Box 2</li>
<li><strong>Social Security Wages</strong> — W-2 Box 3 (max $168,600 in 2025)</li>
<li><strong>Social Security Tax</strong> — W-2 Box 4</li>
<li><strong>Medicare Wages</strong> — W-2 Box 5 (no limit)</li>
<li><strong>Medicare Tax</strong> — W-2 Box 6</li>
<li><strong>State Wages</strong> — W-2 Box 16</li>
<li><strong>State Tax Withheld</strong> — W-2 Box 17</li>
<li><strong>401(k) Contributions</strong> — W-2 Box 12 Code D</li>
<li><strong>Health Insurance</strong> — W-2 Box 12 Code DD (informational)</li>
</ul>

<h3>Common Discrepancies</h3>
<ul>
<li>W-2 Box 1 may differ from gross wages due to pre-tax deductions</li>
<li>Pre-tax 401(k) reduces Box 1 but NOT Social Security/Medicare wages</li>
<li>HSA contributions may reduce Box 1 but show in Box 12 Code W</li>
</ul>

<h3>What to Do If Numbers Don't Match</h3>
<p>Contact payroll immediately. W-2s must be issued by January 31. If an error exists, request a corrected W-2c before filing your tax return.</p>`
  },

  // ── NEW PAYROLL BASICS ──────────────────────────────────────
  {
    id: "minimum-wage-guide",
    category: "payroll-basics",
    title: "Minimum Wage Guide: Federal vs. State Rates (2025-2026)",
    summary: "A complete breakdown of federal and state minimum wages, tipped employee rules, and upcoming changes.",
    readTime: "6 min",
    content: `<h2>Minimum Wage: Federal vs. State</h2>
<p>The federal minimum wage has been <strong>$7.25/hour</strong> since 2009. However, 30+ states and many cities set higher rates.</p>

<h3>Highest State Minimum Wages (2025)</h3>
<table>
<tr><th>State</th><th>Rate</th><th>Notes</th></tr>
<tr><td>Washington</td><td>$16.66</td><td>Indexed to inflation annually</td></tr>
<tr><td>California</td><td>$16.50</td><td>Fast food: $20.00</td></tr>
<tr><td>New York</td><td>$16.00</td><td>NYC: $16.00 (unified)</td></tr>
<tr><td>Massachusetts</td><td>$15.00</td><td>Tipped: $6.75</td></tr>
<tr><td>Connecticut</td><td>$16.35</td><td>Indexed to employment cost index</td></tr>
<tr><td>New Jersey</td><td>$15.49</td><td>Indexed to CPI</td></tr>
</table>

<h3>Tipped Employee Rules</h3>
<p>Federal tipped minimum wage is <strong>$2.13/hour</strong>, but employers must ensure total compensation (tips + wage) meets the standard minimum. If tips fall short, the employer must make up the difference.</p>
<ul>
<li><strong>Tip credit:</strong> Difference between tipped wage and standard minimum ($7.25 - $2.13 = $5.12)</li>
<li>7 states require <strong>full minimum wage</strong> before tips: AK, CA, MN, MT, NV, OR, WA</li>
<li>Tips must be reported for tax purposes regardless</li>
</ul>

<h3>Which Rate Applies?</h3>
<p>When federal and state rates differ, the <strong>higher rate</strong> always applies. City/county rates may be even higher (Seattle: $19.97, San Francisco: $18.67).</p>

<h3>Exempt from Minimum Wage</h3>
<ul>
<li>Full-time students (85% of minimum)</li>
<li>Workers with disabilities under DOL certificates</li>
<li>Youth under 20 (first 90 days: $4.25)</li>
<li>Some agricultural workers</li>
</ul>`
  },
  {
    id: "bonus-pay-explained",
    category: "payroll-basics",
    title: "Bonus Pay: Types, Taxes, and How It Appears on Your Stub",
    summary: "How bonuses are taxed differently from regular pay and what to expect on your pay stub.",
    readTime: "5 min",
    content: `<h2>Bonus Pay Explained</h2>
<p>Bonuses are classified as <strong>supplemental wages</strong> by the IRS and are taxed differently from your regular paycheck.</p>

<h3>Types of Bonuses</h3>
<ul>
<li><strong>Discretionary:</strong> Not promised or expected (holiday gifts, spot bonuses)</li>
<li><strong>Non-discretionary:</strong> Based on criteria (performance, sales targets, signing bonuses)</li>
<li><strong>Retention:</strong> Paid to keep employees from leaving</li>
<li><strong>Referral:</strong> For recruiting new employees</li>
<li><strong>Year-end/Annual:</strong> Based on company or individual performance</li>
<li><strong>Commission:</strong> Percentage of sales (also supplemental wages)</li>
</ul>

<h3>How Bonuses Are Taxed</h3>
<p>The IRS allows two methods:</p>
<h4>Percentage Method (Most Common)</h4>
<p>Flat <strong>22%</strong> federal withholding on bonuses up to $1 million. Bonuses over $1M are taxed at 37% on the excess.</p>

<h4>Aggregate Method</h4>
<p>Bonus is added to your regular pay for the period, and tax is calculated on the combined total. This often results in higher withholding but evens out at tax filing.</p>

<h3>Other Taxes on Bonuses</h3>
<table>
<tr><th>Tax</th><th>Rate</th><th>Applies?</th></tr>
<tr><td>Social Security</td><td>6.2%</td><td>Yes (up to wage base)</td></tr>
<tr><td>Medicare</td><td>1.45%</td><td>Yes (all earnings)</td></tr>
<tr><td>State Income Tax</td><td>Varies</td><td>Yes (most states)</td></tr>
</table>

<h3>On Your Pay Stub</h3>
<p>Look for a line item labeled "Bonus," "Supplemental," or "Incentive" in the earnings section. The federal tax line may show a higher withholding percentage than usual.</p>`
  },
  {
    id: "direct-deposit-explained",
    category: "payroll-basics",
    title: "Direct Deposit: How It Works and Why It Matters",
    summary: "Everything about direct deposit setup, split deposits, timing, and troubleshooting.",
    readTime: "4 min",
    content: `<h2>Direct Deposit Explained</h2>
<p>Direct deposit is an electronic payment method that transfers wages directly into an employee's bank account via the ACH (Automated Clearing House) network.</p>

<h3>How It Works</h3>
<ol>
<li>Employee provides bank routing and account numbers to employer</li>
<li>Employer submits payroll to their bank or payroll provider</li>
<li>Funds are transmitted via ACH network (typically 1-2 business days)</li>
<li>Employee's bank receives and credits the account</li>
</ol>

<h3>Benefits</h3>
<ul>
<li><strong>Speed:</strong> Funds available on pay day (no check-cashing delays)</li>
<li><strong>Security:</strong> No lost or stolen checks</li>
<li><strong>Convenience:</strong> No trips to the bank</li>
<li><strong>Cost savings:</strong> No check-cashing fees</li>
<li><strong>Split deposits:</strong> Automatically divide pay between checking and savings</li>
</ul>

<h3>Split Deposit Strategy</h3>
<p>Many employers allow splitting direct deposit between multiple accounts. A popular strategy:</p>
<ul>
<li>80% to checking (bills, expenses)</li>
<li>10% to savings (emergency fund)</li>
<li>10% to investment account (wealth building)</li>
</ul>

<h3>Timing</h3>
<p>Most direct deposits process overnight and are available by <strong>6 AM</strong> on pay day. Some banks offer early access 1-2 days before the official pay date.</p>

<h3>Can My Employer Require Direct Deposit?</h3>
<p>In most states, yes — employers can mandate direct deposit as long as they don't charge employees for the service. However, some states (like California) require employers to offer at least one alternative payment method.</p>`
  },
  {
    id: "salary-vs-hourly",
    category: "payroll-basics",
    title: "Salary vs. Hourly: Which Is Better for You?",
    summary: "Compare salaried and hourly pay structures, including benefits, overtime eligibility, and take-home implications.",
    readTime: "5 min",
    content: `<h2>Salary vs. Hourly Pay</h2>
<p>Understanding the difference between salary and hourly compensation affects your paycheck, benefits, and work-life balance.</p>

<h3>Key Differences</h3>
<table>
<tr><th>Factor</th><th>Salary</th><th>Hourly</th></tr>
<tr><td>Pay Structure</td><td>Fixed annual amount</td><td>Per-hour rate</td></tr>
<tr><td>Overtime</td><td>Usually exempt</td><td>Must receive OT (1.5x)</td></tr>
<tr><td>Schedule</td><td>Often flexible</td><td>Clock in/out required</td></tr>
<tr><td>Benefits</td><td>Usually full package</td><td>May be limited</td></tr>
<tr><td>Pay Consistency</td><td>Same every check</td><td>Varies by hours</td></tr>
<tr><td>Income Potential</td><td>Fixed (plus bonuses)</td><td>Unlimited with OT</td></tr>
</table>

<h3>When Salary Pays More</h3>
<ul>
<li>Stable workweek of 40 hours or fewer</li>
<li>Strong benefits package (health, 401k match, PTO)</li>
<li>Career advancement opportunities tied to salary bands</li>
<li>Bonus/equity compensation on top of base</li>
</ul>

<h3>When Hourly Pays More</h3>
<ul>
<li>Regular overtime availability (time-and-a-half adds up fast)</li>
<li>Shift differentials (nights, weekends, holidays)</li>
<li>High hourly rate in skilled trades or healthcare</li>
<li>Multiple job flexibility</li>
</ul>

<h3>Conversion Formula</h3>
<p><strong>Salary to hourly:</strong> Annual salary / 2,080 = hourly rate</p>
<p><strong>Hourly to salary:</strong> Hourly rate x 2,080 = annual salary</p>
<p><em>Example:</em> $60,000 salary = $28.85/hour. A $25/hour worker earning 5 hours OT weekly = $72,500 effective annual pay.</p>`
  },
  {
    id: "payroll-taxes-101",
    category: "payroll-basics",
    title: "Payroll Taxes 101: Every Tax on Your Paycheck Explained",
    summary: "A comprehensive guide to every tax that appears on your pay stub and who pays what.",
    readTime: "7 min",
    content: `<h2>Payroll Taxes 101</h2>
<p>Your paycheck is subject to multiple taxes at the federal, state, and sometimes local level. Here's every tax you need to know.</p>

<h3>Federal Taxes</h3>

<h4>Federal Income Tax (FIT)</h4>
<p>Progressive tax based on income and filing status. Withheld based on your W-4.</p>
<table>
<tr><th>Tax Bracket (Single)</th><th>Rate</th></tr>
<tr><td>$0 - $11,600</td><td>10%</td></tr>
<tr><td>$11,601 - $47,150</td><td>12%</td></tr>
<tr><td>$47,151 - $100,525</td><td>22%</td></tr>
<tr><td>$100,526 - $191,950</td><td>24%</td></tr>
<tr><td>$191,951 - $243,725</td><td>32%</td></tr>
<tr><td>$243,726 - $609,350</td><td>35%</td></tr>
<tr><td>$609,351+</td><td>37%</td></tr>
</table>

<h4>Social Security (OASDI)</h4>
<p>6.2% on wages up to $168,600. Funds retirement and disability benefits.</p>

<h4>Medicare (HI)</h4>
<p>1.45% on all wages. Additional 0.9% on wages over $200,000 (single). Funds healthcare for seniors.</p>

<h3>State Taxes</h3>
<ul>
<li><strong>State Income Tax:</strong> 0% to 13.3% depending on state</li>
<li><strong>State Disability Insurance (SDI):</strong> CA, HI, NJ, NY, RI mandate employee-paid SDI</li>
<li><strong>Paid Family Leave (PFL):</strong> Some states deduct for family leave insurance</li>
<li><strong>State Unemployment (SUTA):</strong> Employer-paid in most states (AK, NJ, PA also deduct from employees)</li>
</ul>

<h3>Local Taxes</h3>
<ul>
<li><strong>City/County Income Tax:</strong> NYC (3.1%-3.9%), Philadelphia (3.75%), Detroit (2.4%)</li>
<li><strong>School District Tax:</strong> Common in Ohio and Pennsylvania</li>
<li><strong>Transit Taxes:</strong> Portland (0.7637%), San Francisco (varies)</li>
</ul>

<h3>Employer-Only Taxes (Not on Your Stub)</h3>
<ul>
<li><strong>FUTA:</strong> Federal unemployment tax (6% on first $7,000, reduced to 0.6% with state credit)</li>
<li><strong>SUTA:</strong> State unemployment (varies by state and employer's claims history)</li>
<li><strong>Workers' Comp:</strong> Insurance premiums based on industry risk class</li>
</ul>`
  },
  {
    id: "understanding-ytd",
    category: "payroll-basics",
    title: "YTD on Your Pay Stub: What Year-to-Date Totals Mean",
    summary: "How to read and use your year-to-date figures for budgeting, tax planning, and W-2 verification.",
    readTime: "4 min",
    content: `<h2>Understanding YTD on Your Pay Stub</h2>
<p><strong>YTD (Year-to-Date)</strong> figures on your pay stub show cumulative totals for every earnings and deduction category since January 1 of the current year.</p>

<h3>Why YTD Matters</h3>
<ul>
<li><strong>Tax planning:</strong> Track whether you're on pace to owe or get a refund</li>
<li><strong>W-2 verification:</strong> Your final YTD should closely match your W-2</li>
<li><strong>Loan applications:</strong> Lenders use YTD to verify current income trajectory</li>
<li><strong>Benefits limits:</strong> Track progress toward 401(k), HSA, and FSA contribution limits</li>
<li><strong>Social Security wage base:</strong> Once YTD wages hit $168,600, SS tax stops</li>
</ul>

<h3>Key YTD Fields to Monitor</h3>
<table>
<tr><th>Field</th><th>What to Watch</th></tr>
<tr><td>Gross Earnings YTD</td><td>Should align with salary/rate x periods worked</td></tr>
<tr><td>Federal Tax YTD</td><td>Compare to estimated annual tax liability</td></tr>
<tr><td>SS Wages YTD</td><td>Stops at $168,600 wage base</td></tr>
<tr><td>401(k) YTD</td><td>Track against $23,500 annual limit</td></tr>
<tr><td>PTO Balance</td><td>Plan vacation usage before year-end</td></tr>
</table>

<h3>Mid-Year Check</h3>
<p>In June or July, multiply your per-period federal tax by remaining pay periods. Add to your current YTD federal tax. If the total is significantly more or less than your expected tax liability, adjust your W-4.</p>

<h3>Common YTD Issues</h3>
<ul>
<li>YTD doesn't match if you changed jobs mid-year (each employer tracks separately)</li>
<li>Retroactive pay adjustments may cause a single-period spike</li>
<li>Pre-tax deductions reduce taxable YTD wages but not gross YTD wages</li>
</ul>`
  },

  // ── NEW TIPS & TRICKS ───────────────────────────────────────
  {
    id: "tax-refund-strategies",
    category: "tips",
    title: "5 Strategies to Maximize Your Tax Refund",
    summary: "Actionable tips to keep more money in your pocket at tax time without changing your salary.",
    readTime: "5 min",
    content: `<h2>5 Strategies to Maximize Your Tax Refund</h2>
<p>Your tax refund is simply an overpayment returned to you. But with smart planning, you can ensure you're getting every dollar you deserve.</p>

<h3>1. Optimize Your W-4</h3>
<p>If you consistently get large refunds (over $1,000), you're giving the government an interest-free loan. Use the IRS Tax Withholding Estimator to fine-tune your W-4 so more money lands in each paycheck.</p>

<h3>2. Max Out Pre-Tax Deductions</h3>
<ul>
<li><strong>401(k):</strong> Up to $23,500 (2025). Every dollar reduces taxable income.</li>
<li><strong>HSA:</strong> $4,300 individual / $8,550 family. Triple tax advantage.</li>
<li><strong>FSA:</strong> $3,300 for healthcare, $5,000 for dependent care.</li>
<li><strong>Transit:</strong> Up to $325/month pre-tax for commuter benefits.</li>
</ul>

<h3>3. Track All Deductible Expenses</h3>
<p>If you itemize deductions, keep records of:</p>
<ul>
<li>Mortgage interest and property taxes</li>
<li>State and local taxes (up to $10,000 SALT cap)</li>
<li>Charitable contributions</li>
<li>Medical expenses exceeding 7.5% of AGI</li>
<li>Home office (if self-employed)</li>
</ul>

<h3>4. Claim All Eligible Credits</h3>
<ul>
<li><strong>Earned Income Tax Credit (EITC):</strong> Up to $7,830 for families</li>
<li><strong>Child Tax Credit:</strong> $2,000 per qualifying child</li>
<li><strong>Saver's Credit:</strong> Up to $1,000 for retirement contributions (income limits apply)</li>
<li><strong>Education Credits:</strong> American Opportunity ($2,500) or Lifetime Learning ($2,000)</li>
</ul>

<h3>5. File on Time, File Accurately</h3>
<p>Late filing means penalties and lost refund interest. Double-check all numbers against your pay stubs and W-2 before submitting.</p>`
  },
  {
    id: "negotiate-salary-benefits",
    category: "tips",
    title: "How to Negotiate Your Salary and Benefits Package",
    summary: "Proven techniques to negotiate higher pay, better benefits, and more favorable compensation terms.",
    readTime: "6 min",
    content: `<h2>How to Negotiate Your Salary and Benefits</h2>
<p>Most employers expect negotiation. Research shows that employees who negotiate earn $5,000-$10,000 more per year on average.</p>

<h3>Before the Conversation</h3>
<ul>
<li><strong>Research market rates:</strong> Use Glassdoor, BLS, PayScale, Levels.fyi for your role + location</li>
<li><strong>Know your number:</strong> Determine your minimum acceptable salary and your target (aim 10-20% above)</li>
<li><strong>Document your value:</strong> Quantify achievements (revenue generated, costs saved, projects completed)</li>
<li><strong>Timing matters:</strong> Negotiate after receiving an offer, during annual reviews, or after a major win</li>
</ul>

<h3>During Negotiation</h3>
<ol>
<li>Express enthusiasm for the role first</li>
<li>Let them name a number first when possible</li>
<li>Counter with your researched range (not a single number)</li>
<li>Use silence — don't fill awkward pauses with concessions</li>
<li>Focus on total compensation, not just base salary</li>
</ol>

<h3>Beyond Base Salary: What to Negotiate</h3>
<table>
<tr><th>Benefit</th><th>Typical Value</th></tr>
<tr><td>Signing Bonus</td><td>$2,000 - $25,000+</td></tr>
<tr><td>401(k) Match</td><td>3-6% of salary</td></tr>
<tr><td>Extra PTO</td><td>5-10 additional days</td></tr>
<tr><td>Remote/Hybrid Work</td><td>Saves commute + flexibility</td></tr>
<tr><td>Education Budget</td><td>$2,000 - $10,000/yr</td></tr>
<tr><td>Relocation Package</td><td>$5,000 - $50,000</td></tr>
<tr><td>Equity/Stock Options</td><td>Varies widely</td></tr>
</table>

<h3>If They Say No</h3>
<p>Ask: "What would it take to revisit this in 6 months?" Get any promises in writing and set a calendar reminder to follow up.</p>`
  },
  {
    id: "remote-work-tax-tips",
    category: "tips",
    title: "Remote Work Tax Tips: Multi-State and Home Office Rules",
    summary: "Navigate the tax complexities of working remotely, including multi-state taxation and home office deductions.",
    readTime: "5 min",
    content: `<h2>Remote Work Tax Tips</h2>
<p>Remote work has created new tax complexities. Where you physically work can affect which states tax your income.</p>

<h3>Multi-State Taxation</h3>
<p>If you live in one state and your employer is in another:</p>
<ul>
<li><strong>Physical presence rule:</strong> Most states tax you based on where you physically perform work</li>
<li><strong>Convenience of employer rule:</strong> NY, CT, NE, PA, and others tax remote workers based on the employer's state</li>
<li><strong>Credits:</strong> Your home state usually gives a credit for taxes paid to other states</li>
</ul>

<h3>Home Office Deduction</h3>
<p><strong>W-2 employees:</strong> Cannot deduct home office expenses (eliminated by Tax Cuts and Jobs Act through 2025).</p>
<p><strong>Self-employed/1099:</strong> Can deduct home office using:</p>
<ul>
<li><strong>Simplified method:</strong> $5/sq ft, max 300 sq ft = $1,500 max</li>
<li><strong>Regular method:</strong> Actual expenses (rent, utilities, insurance) prorated by office square footage</li>
</ul>

<h3>Equipment and Expenses</h3>
<ul>
<li>Some employers provide stipends for internet, phone, equipment</li>
<li>Employer-provided equipment is not taxable income</li>
<li>Stipends for expenses may be taxable (check your pay stub)</li>
<li>Self-employed can deduct computer, desk, chair, software as business expenses</li>
</ul>

<h3>State Registration Triggers</h3>
<p>If your employer has no presence in your state, your remote work could create "nexus" — requiring the company to register and withhold state taxes. Employers increasingly track employee locations for compliance.</p>`
  },
  {
    id: "side-hustle-taxes",
    category: "tips",
    title: "Side Hustle Taxes: What Gig Workers Need to Know",
    summary: "Tax obligations for freelancers, gig workers, and anyone with a side business alongside W-2 employment.",
    readTime: "5 min",
    content: `<h2>Side Hustle Taxes</h2>
<p>If you earn money outside of W-2 employment, you have additional tax obligations. This applies to freelancing, rideshare, delivery, e-commerce, and any other gig work.</p>

<h3>Self-Employment Tax</h3>
<p>You owe <strong>15.3%</strong> self-employment tax on net earnings (12.4% Social Security + 2.9% Medicare). This is in addition to regular income tax.</p>

<h3>When Must You Pay?</h3>
<ul>
<li>Net self-employment income of <strong>$400 or more</strong> requires filing</li>
<li>If you expect to owe $1,000+ in taxes, make <strong>quarterly estimated payments</strong></li>
<li>Due dates: April 15, June 15, September 15, January 15</li>
</ul>

<h3>Deductible Expenses</h3>
<table>
<tr><th>Category</th><th>Examples</th></tr>
<tr><td>Vehicle</td><td>67 cents/mile (2024) or actual expenses</td></tr>
<tr><td>Supplies</td><td>Equipment, software, materials</td></tr>
<tr><td>Home office</td><td>$5/sq ft (simplified) or actual costs</td></tr>
<tr><td>Phone/Internet</td><td>Business-use percentage</td></tr>
<tr><td>Insurance</td><td>Health insurance premiums (SE deduction)</td></tr>
<tr><td>Education</td><td>Courses, certifications related to your work</td></tr>
<tr><td>Retirement</td><td>SEP IRA (25% of net), Solo 401(k) ($23,500+)</td></tr>
</table>

<h3>W-2 + 1099 Strategy</h3>
<p>If you have a W-2 job and a side hustle, increase your W-4 withholding at your main job to cover the extra tax from your side income. This avoids quarterly estimated payments.</p>

<h3>Record Keeping</h3>
<p>Keep receipts, mileage logs, and bank statements. Use a separate bank account for business income and expenses. The IRS requires records be kept for at least 3 years.</p>`
  },
  {
    id: "paycheck-budgeting",
    category: "tips",
    title: "Paycheck Budgeting: The 50/30/20 and Other Methods",
    summary: "How to build a budget around your actual take-home pay using proven frameworks.",
    readTime: "5 min",
    content: `<h2>Paycheck Budgeting</h2>
<p>The best budget starts with your <strong>net pay</strong> (take-home), not gross. Use your pay stub to determine exactly what hits your bank account each period.</p>

<h3>The 50/30/20 Rule</h3>
<table>
<tr><th>Category</th><th>% of Net Pay</th><th>Example ($4,000 net)</th></tr>
<tr><td>Needs</td><td>50%</td><td>$2,000</td></tr>
<tr><td>Wants</td><td>30%</td><td>$1,200</td></tr>
<tr><td>Savings/Debt</td><td>20%</td><td>$800</td></tr>
</table>

<h3>Needs (50%)</h3>
<ul>
<li>Rent/mortgage</li>
<li>Utilities (electric, water, gas)</li>
<li>Groceries</li>
<li>Transportation (car payment, gas, insurance)</li>
<li>Minimum debt payments</li>
<li>Health insurance (if not pre-tax)</li>
</ul>

<h3>Wants (30%)</h3>
<ul>
<li>Dining out and entertainment</li>
<li>Subscriptions (streaming, gym)</li>
<li>Shopping and hobbies</li>
<li>Travel and vacations</li>
</ul>

<h3>Savings and Debt (20%)</h3>
<ul>
<li>Emergency fund (target: 3-6 months of expenses)</li>
<li>Extra debt payments beyond minimums</li>
<li>Investments (brokerage, Roth IRA)</li>
<li>Note: 401(k) comes out pre-tax, so it's "extra" savings on top</li>
</ul>

<h3>Alternative: Zero-Based Budgeting</h3>
<p>Assign every dollar of net pay a job until you reach $0 remaining. More detailed but gives maximum control. Every paycheck, allocate funds to specific categories before spending.</p>

<h3>Bi-Weekly Pay Tip</h3>
<p>If paid bi-weekly (26 checks/year), you get 2 "extra" paychecks. Budget based on 24 paychecks and use the 2 extras for savings goals or debt payoff.</p>`
  },
  {
    id: "avoid-tax-penalties",
    category: "tips",
    title: "How to Avoid IRS Penalties and Underpayment Fees",
    summary: "Common tax penalties and how to prevent them through proper withholding and estimated payments.",
    readTime: "4 min",
    content: `<h2>How to Avoid IRS Penalties</h2>
<p>The IRS charges penalties for underpayment, late filing, and late payment. Most are avoidable with proper planning.</p>

<h3>Underpayment Penalty</h3>
<p>You owe a penalty if you paid less than <strong>90% of this year's tax</strong> or <strong>100% of last year's tax</strong> (110% if AGI > $150K). The penalty rate equals the federal short-term rate + 3%.</p>

<h3>Safe Harbor Rules</h3>
<p>You avoid penalties if you meet any of these:</p>
<ul>
<li>You owe less than $1,000 at filing</li>
<li>You paid at least 90% of the current year's tax</li>
<li>You paid at least 100% of last year's tax (110% if AGI over $150K)</li>
<li>Withholding was at least equal to your prior year's total tax</li>
</ul>

<h3>Common Penalty Triggers</h3>
<table>
<tr><th>Situation</th><th>Penalty</th></tr>
<tr><td>Late filing (with balance due)</td><td>5%/month of unpaid tax, max 25%</td></tr>
<tr><td>Late payment</td><td>0.5%/month of unpaid tax, max 25%</td></tr>
<tr><td>Underpayment</td><td>~8% annually (2024 rate)</td></tr>
<tr><td>Bounced payment</td><td>$25+ or 2% of payment</td></tr>
<tr><td>Failure to file</td><td>Minimum $485 if 60+ days late</td></tr>
</table>

<h3>Prevention Checklist</h3>
<ol>
<li>Check your withholding using the IRS Estimator every January and after life changes</li>
<li>If self-employed, make quarterly estimated payments</li>
<li>File on time, even if you can't pay (request an installment agreement)</li>
<li>Set up direct pay at IRS.gov for estimated payments</li>
</ol>`
  },

  // ── NEW COMPLIANCE & LAW ────────────────────────────────────
  {
    id: "state-minimum-wage-laws",
    category: "compliance",
    title: "State Minimum Wage Laws: A 50-State Compliance Guide",
    summary: "State-by-state minimum wage requirements, scheduled increases, and employer obligations.",
    readTime: "6 min",
    content: `<h2>State Minimum Wage Compliance</h2>
<p>Employers must comply with whichever minimum wage is highest: federal, state, or local. As of 2025, 30 states plus D.C. have rates above the federal $7.25.</p>

<h3>States With Scheduled Increases</h3>
<table>
<tr><th>State</th><th>2025 Rate</th><th>Increase Method</th></tr>
<tr><td>California</td><td>$16.50</td><td>Legislative + industry-specific</td></tr>
<tr><td>Colorado</td><td>$14.81</td><td>CPI adjustment annually</td></tr>
<tr><td>Florida</td><td>$14.00</td><td>$1/year until $15 (2026)</td></tr>
<tr><td>Illinois</td><td>$15.00</td><td>Reached target in 2025</td></tr>
<tr><td>Washington</td><td>$16.66</td><td>CPI adjustment annually</td></tr>
<tr><td>Arizona</td><td>$14.70</td><td>CPI adjustment annually</td></tr>
</table>

<h3>Employer Posting Requirements</h3>
<ul>
<li>All states require minimum wage posters in the workplace</li>
<li>Must be displayed in a conspicuous location accessible to all employees</li>
<li>Remote employers may need to distribute electronically</li>
<li>Fines for non-compliance: $100-$10,000+ depending on state</li>
</ul>

<h3>Industry-Specific Rates</h3>
<ul>
<li><strong>Fast food (CA):</strong> $20.00/hour</li>
<li><strong>Healthcare (CA):</strong> $25.00/hour (phasing in)</li>
<li><strong>Large employers (MN):</strong> Higher rate than small employers</li>
<li><strong>NYC hospitality:</strong> No tip credit allowed</li>
</ul>

<h3>Penalties for Violations</h3>
<p>Paying below minimum wage can result in back pay, liquidated damages (often double the underpayment), attorney fees, and state fines. Repeat violations may trigger criminal penalties.</p>`
  },
  {
    id: "equal-pay-compliance",
    category: "compliance",
    title: "Equal Pay Act and Pay Transparency Laws",
    summary: "Understanding federal equal pay requirements and the growing wave of state pay transparency mandates.",
    readTime: "5 min",
    content: `<h2>Equal Pay and Pay Transparency</h2>
<p>Federal and state laws prohibit pay discrimination and increasingly require employers to be transparent about compensation.</p>

<h3>Federal Equal Pay Act (EPA)</h3>
<p>Requires equal pay for equal work regardless of sex. "Equal work" means jobs requiring substantially equal skill, effort, responsibility, and similar working conditions.</p>
<p>Permitted pay differences must be based on:</p>
<ul>
<li>Seniority system</li>
<li>Merit system</li>
<li>Quality or quantity of production</li>
<li>A factor other than sex (education, experience, certifications)</li>
</ul>

<h3>State Pay Transparency Laws</h3>
<table>
<tr><th>State</th><th>Requirement</th></tr>
<tr><td>Colorado</td><td>Salary range required in all job postings</td></tr>
<tr><td>California</td><td>Salary range in postings (15+ employees)</td></tr>
<tr><td>New York</td><td>Salary range in postings (4+ employees)</td></tr>
<tr><td>Washington</td><td>Salary range in postings (15+ employees)</td></tr>
<tr><td>Connecticut</td><td>Salary range upon request or offer</td></tr>
<tr><td>Maryland</td><td>Salary range upon applicant request</td></tr>
<tr><td>Illinois</td><td>Salary range in postings (15+ employees, eff. 2025)</td></tr>
</table>

<h3>Salary History Bans</h3>
<p>21+ states and many cities prohibit employers from asking about prior salary. This prevents past discrimination from compounding. Employers must base offers on the role's value, not the candidate's history.</p>

<h3>Employer Best Practices</h3>
<ul>
<li>Conduct annual pay audits comparing compensation across demographics</li>
<li>Document legitimate business reasons for pay differences</li>
<li>Train managers on compliant interviewing and offer practices</li>
<li>Establish clear salary bands for each position</li>
</ul>`
  },
  {
    id: "fmla-leave-guide",
    category: "compliance",
    title: "FMLA and Paid Family Leave: Employee Rights Guide",
    summary: "Your rights under the Family and Medical Leave Act and state paid leave programs.",
    readTime: "5 min",
    content: `<h2>FMLA and Paid Family Leave</h2>
<p>The Family and Medical Leave Act (FMLA) provides eligible employees up to <strong>12 weeks of unpaid, job-protected leave</strong> per year. Many states now offer paid leave on top of this.</p>

<h3>FMLA Eligibility</h3>
<ul>
<li>Employer has 50+ employees within 75 miles</li>
<li>Employee worked at least 12 months</li>
<li>Employee worked at least 1,250 hours in the past 12 months</li>
</ul>

<h3>Qualifying Reasons</h3>
<ul>
<li>Birth or adoption of a child</li>
<li>Care for spouse, child, or parent with serious health condition</li>
<li>Employee's own serious health condition</li>
<li>Qualifying military exigency (up to 26 weeks for military caregiver)</li>
</ul>

<h3>State Paid Family Leave Programs</h3>
<table>
<tr><th>State</th><th>Duration</th><th>Wage Replacement</th></tr>
<tr><td>California</td><td>8 weeks</td><td>60-70% of wages</td></tr>
<tr><td>New York</td><td>12 weeks</td><td>67% (up to cap)</td></tr>
<tr><td>New Jersey</td><td>12 weeks</td><td>85% (up to cap)</td></tr>
<tr><td>Washington</td><td>12 weeks</td><td>Up to 90%</td></tr>
<tr><td>Massachusetts</td><td>12-26 weeks</td><td>80% (up to cap)</td></tr>
<tr><td>Colorado</td><td>12 weeks</td><td>Up to 90%</td></tr>
<tr><td>Connecticut</td><td>12 weeks</td><td>Up to 95%</td></tr>
<tr><td>Oregon</td><td>12 weeks</td><td>Up to 100%</td></tr>
</table>

<h3>How It Affects Your Pay Stub</h3>
<p>During FMLA, you may see reduced or zero earnings but continued benefit deductions. State paid leave shows as a separate income source. Health insurance premiums continue during leave.</p>`
  },
  {
    id: "final-paycheck-laws",
    category: "compliance",
    title: "Final Paycheck Laws: What Employers Owe When You Leave",
    summary: "State-by-state rules for when your last paycheck must be issued after resignation or termination.",
    readTime: "4 min",
    content: `<h2>Final Paycheck Laws</h2>
<p>When employment ends, states have specific deadlines for issuing the final paycheck. Violations can result in penalties equal to days of continued pay.</p>

<h3>Termination (Involuntary)</h3>
<table>
<tr><th>Timing</th><th>States</th></tr>
<tr><td>Immediately / Same day</td><td>CA, CO, MT, MO (if requested)</td></tr>
<tr><td>Within 24 hours</td><td>No states mandate exactly 24h</td></tr>
<tr><td>Within 3 days</td><td>AK</td></tr>
<tr><td>Next scheduled pay day</td><td>AZ, FL, GA, IL, IN, MI, MN, NJ, NY, OH, PA, TX, VA, WA, WI, and many more</td></tr>
</table>

<h3>Resignation (Voluntary)</h3>
<table>
<tr><th>Timing</th><th>States</th></tr>
<tr><td>Within 72 hours</td><td>CA (no notice given)</td></tr>
<tr><td>Last day of work</td><td>CA (72+ hours notice given)</td></tr>
<tr><td>Next scheduled pay day</td><td>Most states</td></tr>
</table>

<h3>What Must Be Included</h3>
<ul>
<li>All earned wages through the last day worked</li>
<li>Accrued, unused vacation/PTO (in states that require it: CA, CO, IL, MA, MT, NE, ND)</li>
<li>Earned commissions and bonuses</li>
<li>Expense reimbursements</li>
</ul>

<h3>Penalties for Late Payment</h3>
<ul>
<li><strong>California:</strong> Waiting time penalties of full daily wage for up to 30 days</li>
<li><strong>Colorado:</strong> Penalties up to 200% of unpaid wages</li>
<li><strong>New York:</strong> Liquidated damages + attorney fees</li>
<li>Most states allow employees to file wage claims with the state labor department</li>
</ul>`
  },
  {
    id: "payroll-recordkeeping",
    category: "compliance",
    title: "Payroll Recordkeeping Requirements: What Employers Must Retain",
    summary: "Federal and state mandates for how long payroll records, tax documents, and employee files must be kept.",
    readTime: "4 min",
    content: `<h2>Payroll Recordkeeping Requirements</h2>
<p>Multiple federal agencies and state laws require employers to maintain payroll records for specific periods. Non-compliance can result in penalties and legal exposure.</p>

<h3>Federal Requirements</h3>
<table>
<tr><th>Record Type</th><th>Retention Period</th><th>Agency</th></tr>
<tr><td>Payroll records (hours, wages, deductions)</td><td>3 years</td><td>FLSA / DOL</td></tr>
<tr><td>Time cards and schedules</td><td>2 years</td><td>FLSA / DOL</td></tr>
<tr><td>Tax records (W-4, 941, W-2 copies)</td><td>4 years after tax due/paid</td><td>IRS</td></tr>
<tr><td>I-9 forms</td><td>3 years from hire or 1 year after termination</td><td>USCIS</td></tr>
<tr><td>EEO-1 reports</td><td>1 year (2 years for federal contractors)</td><td>EEOC</td></tr>
<tr><td>OSHA injury logs</td><td>5 years</td><td>OSHA</td></tr>
<tr><td>FMLA records</td><td>3 years</td><td>DOL</td></tr>
</table>

<h3>State Requirements</h3>
<p>Many states require longer retention periods:</p>
<ul>
<li><strong>California:</strong> Payroll records for 4 years</li>
<li><strong>New York:</strong> Payroll records for 6 years</li>
<li><strong>Washington:</strong> Payroll records for 3 years</li>
</ul>
<p>Best practice: retain all payroll records for at least <strong>7 years</strong> to cover all federal and state requirements.</p>

<h3>What Records to Keep</h3>
<ul>
<li>Employee name, address, SSN, date of birth</li>
<li>Hours worked each day and each week</li>
<li>Regular hourly rate and basis of pay</li>
<li>Total overtime earnings per week</li>
<li>All additions to and deductions from wages</li>
<li>Total wages paid each pay period</li>
<li>Date of payment and pay period covered</li>
<li>W-4 forms and any changes</li>
</ul>

<h3>Digital vs. Paper</h3>
<p>The IRS and DOL accept electronic records as long as they are legible, accessible, and reproducible. Implement secure backup systems and restrict access to authorized personnel only.</p>`
  },
  {
    id: "overtime-laws-by-state",
    category: "compliance",
    title: "Overtime Laws by State: Beyond Federal FLSA Requirements",
    summary: "States with stricter overtime rules including daily overtime, double time, and expanded coverage.",
    readTime: "5 min",
    content: `<h2>Overtime Laws by State</h2>
<p>The FLSA requires 1.5x pay for hours over 40/week for non-exempt employees. Several states go further with daily overtime, double time, and broader coverage.</p>

<h3>States With Daily Overtime</h3>
<table>
<tr><th>State</th><th>Daily OT Trigger</th><th>Rate</th></tr>
<tr><td>California</td><td>Over 8 hours/day</td><td>1.5x (over 12h: 2x)</td></tr>
<tr><td>Alaska</td><td>Over 8 hours/day</td><td>1.5x</td></tr>
<tr><td>Nevada</td><td>Over 8 hours/day (if rate < 1.5x min wage)</td><td>1.5x</td></tr>
<tr><td>Colorado</td><td>Over 12 hours/day</td><td>1.5x</td></tr>
</table>

<h3>California's Unique Rules</h3>
<ul>
<li><strong>Over 8 hours/day:</strong> 1.5x regular rate</li>
<li><strong>Over 12 hours/day:</strong> 2x regular rate</li>
<li><strong>7th consecutive day:</strong> 1.5x for first 8 hours, 2x after 8 hours</li>
<li>Alternative workweek schedules allowed with employee vote</li>
</ul>

<h3>Salary Threshold for Exemption</h3>
<p>The federal salary threshold for overtime exemption is <strong>$58,656/year ($1,128/week)</strong> as of 2025. Some states set higher thresholds:</p>
<ul>
<li><strong>California:</strong> 2x state minimum wage ($66,560)</li>
<li><strong>New York:</strong> $62,400 (NYC) / $58,458 (rest of state)</li>
<li><strong>Washington:</strong> 2x state minimum wage (~$69,305)</li>
<li><strong>Colorado:</strong> $55,000 (2025)</li>
</ul>

<h3>Common Overtime Violations</h3>
<ul>
<li>Misclassifying non-exempt employees as exempt</li>
<li>Failing to pay for "off-the-clock" work (emails, prep time)</li>
<li>Averaging hours across two weeks instead of calculating per-week</li>
<li>Not including non-discretionary bonuses in the regular rate calculation</li>
</ul>`
  },

  // ── NEW DEDUCTIONS & BENEFITS ───────────────────────────────
  {
    id: "hsa-vs-fsa",
    category: "deductions",
    title: "HSA vs. FSA: Which Health Savings Account Is Right for You?",
    summary: "Compare Health Savings Accounts and Flexible Spending Accounts — eligibility, limits, rollover, and tax benefits.",
    readTime: "5 min",
    content: `<h2>HSA vs. FSA</h2>
<p>Both HSAs and FSAs let you set aside pre-tax money for medical expenses, but they work very differently.</p>

<h3>Side-by-Side Comparison</h3>
<table>
<tr><th>Feature</th><th>HSA</th><th>FSA</th></tr>
<tr><td>Eligibility</td><td>Must have HDHP</td><td>Any employer plan</td></tr>
<tr><td>2025 Contribution Limit</td><td>$4,300 (ind) / $8,550 (fam)</td><td>$3,300</td></tr>
<tr><td>Employer Contributions</td><td>Allowed</td><td>Allowed</td></tr>
<tr><td>Rollover</td><td>Full balance rolls over forever</td><td>Use-it-or-lose-it ($640 carryover)</td></tr>
<tr><td>Portability</td><td>Yours permanently</td><td>Tied to employer</td></tr>
<tr><td>Investment</td><td>Can invest like a 401(k)</td><td>No investing</td></tr>
<tr><td>Tax Benefit</td><td>Triple tax-free</td><td>Pre-tax contributions only</td></tr>
<tr><td>After Age 65</td><td>Withdrawals for any purpose (taxed as income)</td><td>N/A</td></tr>
</table>

<h3>HSA Triple Tax Advantage</h3>
<ol>
<li><strong>Tax-deductible contributions:</strong> Reduce your taxable income</li>
<li><strong>Tax-free growth:</strong> Investments grow without capital gains tax</li>
<li><strong>Tax-free withdrawals:</strong> For qualified medical expenses</li>
</ol>

<h3>HDHP Requirements for HSA</h3>
<p>To open an HSA, your health plan must have:</p>
<ul>
<li>Minimum deductible: $1,650 (individual) / $3,300 (family)</li>
<li>Maximum out-of-pocket: $8,300 (individual) / $16,600 (family)</li>
</ul>

<h3>Best Strategy</h3>
<p>If eligible for HSA: Contribute the max, invest it, and pay medical bills out of pocket. Let the HSA grow as a stealth retirement account. Keep receipts — you can reimburse yourself tax-free years later.</p>`
  },
  {
    id: "life-disability-insurance",
    category: "deductions",
    title: "Life and Disability Insurance Through Your Employer",
    summary: "Understanding employer-sponsored life insurance, short-term and long-term disability, and their pay stub impact.",
    readTime: "4 min",
    content: `<h2>Employer Life and Disability Insurance</h2>
<p>Most employers offer group life and disability insurance as part of their benefits package. Understanding these deductions helps you evaluate your total coverage.</p>

<h3>Group Life Insurance</h3>
<ul>
<li><strong>Basic coverage:</strong> Typically 1-2x annual salary, employer-paid</li>
<li><strong>Supplemental:</strong> Additional coverage you pay for (usually up to 5-8x salary)</li>
<li><strong>Tax rule:</strong> Employer-paid coverage over $50,000 is taxable (shown as "Group Term Life" on your stub)</li>
<li><strong>Imputed income:</strong> The IRS Table I cost for coverage above $50K appears as taxable income</li>
</ul>

<h3>Short-Term Disability (STD)</h3>
<table>
<tr><th>Feature</th><th>Typical</th></tr>
<tr><td>Waiting period</td><td>7-14 days</td></tr>
<tr><td>Duration</td><td>13-26 weeks</td></tr>
<tr><td>Benefit</td><td>60-70% of salary</td></tr>
<tr><td>Paid by</td><td>Employer or employee</td></tr>
</table>

<h3>Long-Term Disability (LTD)</h3>
<table>
<tr><th>Feature</th><th>Typical</th></tr>
<tr><td>Waiting period</td><td>90-180 days</td></tr>
<tr><td>Duration</td><td>2 years to age 65</td></tr>
<tr><td>Benefit</td><td>50-60% of salary</td></tr>
<tr><td>Paid by</td><td>Usually employer</td></tr>
</table>

<h3>Tax Treatment</h3>
<ul>
<li>If <strong>you pay</strong> the premium (post-tax): Benefits are tax-free</li>
<li>If <strong>employer pays</strong> the premium: Benefits are taxable income</li>
<li>Strategy: Opt to pay disability premiums yourself so benefits are tax-free when you need them most</li>
</ul>

<h3>On Your Pay Stub</h3>
<p>Look for line items labeled "Life Ins," "STD," "LTD," "AD&D" (Accidental Death & Dismemberment), or "Group Term Life Imputed." The imputed income line increases your taxable wages without reducing your take-home pay.</p>`
  },
  {
    id: "student-loan-benefits",
    category: "deductions",
    title: "Student Loan Repayment Benefits and Tax Deductions",
    summary: "Employer student loan assistance programs, the student loan interest deduction, and PSLF considerations.",
    readTime: "4 min",
    content: `<h2>Student Loan Benefits</h2>
<p>Student loan debt affects over 43 million Americans. Both tax deductions and employer benefits can reduce the burden.</p>

<h3>Student Loan Interest Deduction</h3>
<ul>
<li>Deduct up to <strong>$2,500</strong> in student loan interest per year</li>
<li>Above-the-line deduction (no need to itemize)</li>
<li>Phase-out: $80,000-$95,000 (single), $165,000-$195,000 (MFJ)</li>
<li>Applies to qualified education loans only</li>
<li>You receive Form 1098-E from your lender</li>
</ul>

<h3>Employer Student Loan Assistance</h3>
<p>Under Section 127, employers can contribute up to <strong>$5,250/year</strong> toward employee student loans tax-free (extended through 2025).</p>
<ul>
<li>Contributions are excluded from employee's taxable income</li>
<li>Employer can pay the lender directly or reimburse the employee</li>
<li>Same $5,250 limit covers all educational assistance (tuition + loans)</li>
</ul>

<h3>Public Service Loan Forgiveness (PSLF)</h3>
<p>If you work for a government or qualifying non-profit employer:</p>
<ul>
<li>120 qualifying payments (10 years) under an income-driven plan</li>
<li>Remaining balance forgiven tax-free</li>
<li>Must be on Direct Loans (consolidate FFEL if needed)</li>
<li>Submit Employment Certification Form annually</li>
</ul>

<h3>On Your Pay Stub</h3>
<p>Employer loan payments may appear as "Student Loan Assistance," "Education Benefit," or "Sec 127 Benefit." If tax-free, it won't increase your taxable wages.</p>`
  },
  {
    id: "equity-compensation",
    category: "deductions",
    title: "Stock Options, RSUs, and ESPP: Equity Compensation on Your Stub",
    summary: "How stock options, restricted stock units, and employee stock purchase plans affect your paycheck and taxes.",
    readTime: "6 min",
    content: `<h2>Equity Compensation</h2>
<p>Many companies offer equity as part of total compensation. Understanding the tax implications prevents surprises on your pay stub and tax return.</p>

<h3>Restricted Stock Units (RSUs)</h3>
<ul>
<li>Shares granted on a vesting schedule (typically 4 years)</li>
<li>When shares vest, their fair market value is <strong>ordinary income</strong></li>
<li>Employer withholds taxes at vesting (often by selling shares to cover)</li>
<li>On your stub: "RSU Income" or "Stock Compensation" in earnings; corresponding tax withholding</li>
</ul>

<h3>Stock Options (ISOs and NSOs)</h3>
<table>
<tr><th>Feature</th><th>ISO (Incentive)</th><th>NSO (Non-Qualified)</th></tr>
<tr><td>Tax at exercise</td><td>No regular tax (AMT may apply)</td><td>Spread taxed as ordinary income</td></tr>
<tr><td>Tax at sale</td><td>Long-term cap gains (if held 1yr after exercise + 2yr after grant)</td><td>Cap gains on appreciation after exercise</td></tr>
<tr><td>On pay stub</td><td>Usually nothing at exercise</td><td>Spread appears as income with withholding</td></tr>
<tr><td>Limit</td><td>$100,000/year vesting</td><td>No limit</td></tr>
</table>

<h3>Employee Stock Purchase Plan (ESPP)</h3>
<ul>
<li>Buy company stock at a discount (typically 15%)</li>
<li>Contributions deducted from paycheck (post-tax)</li>
<li>Maximum $25,000 in stock per year (at fair market value)</li>
<li>On your stub: "ESPP" deduction from each paycheck</li>
<li>Discount is taxed as ordinary income at sale</li>
</ul>

<h3>Tax Withholding Warning</h3>
<p>RSU vesting and NSO exercises can cause large tax spikes. Federal supplemental rate is 22% (37% over $1M). Many people find they owe additional tax at filing because 22% wasn't enough. Consider making estimated payments or adjusting your W-4.</p>`
  },
  {
    id: "retirement-plans-compared",
    category: "deductions",
    title: "401(k) vs. Roth 401(k) vs. IRA: Retirement Plans Compared",
    summary: "A complete comparison of workplace and individual retirement accounts — contribution limits, tax treatment, and strategies.",
    readTime: "6 min",
    content: `<h2>Retirement Plans Compared</h2>
<p>Choosing the right retirement accounts can save you tens of thousands in taxes over your career.</p>

<h3>Workplace Plans</h3>
<table>
<tr><th>Feature</th><th>Traditional 401(k)</th><th>Roth 401(k)</th></tr>
<tr><td>2025 Limit</td><td>$23,500 ($31,000 if 50+)</td><td>$23,500 ($31,000 if 50+)</td></tr>
<tr><td>Tax on contributions</td><td>Pre-tax (reduces current income)</td><td>Post-tax (no current benefit)</td></tr>
<tr><td>Tax on withdrawals</td><td>Taxed as ordinary income</td><td>Tax-free (if qualified)</td></tr>
<tr><td>Employer match</td><td>Always pre-tax</td><td>Match goes to traditional bucket</td></tr>
<tr><td>RMDs</td><td>Required at 73</td><td>None (after 2024 SECURE 2.0)</td></tr>
</table>

<h3>Individual Plans</h3>
<table>
<tr><th>Feature</th><th>Traditional IRA</th><th>Roth IRA</th></tr>
<tr><td>2025 Limit</td><td>$7,000 ($8,000 if 50+)</td><td>$7,000 ($8,000 if 50+)</td></tr>
<tr><td>Income limits</td><td>Deduction phases out with workplace plan</td><td>$150K-$165K (single), $236K-$246K (MFJ)</td></tr>
<tr><td>Tax treatment</td><td>Deductible contributions, taxed withdrawals</td><td>No deduction, tax-free withdrawals</td></tr>
<tr><td>Withdrawal rules</td><td>Penalty before 59.5, RMDs at 73</td><td>Contributions anytime; earnings after 59.5 + 5 years</td></tr>
</table>

<h3>Decision Framework</h3>
<ul>
<li><strong>Choose Traditional 401(k) if:</strong> You're in a high tax bracket now and expect lower in retirement</li>
<li><strong>Choose Roth 401(k) if:</strong> You're in a lower bracket now or want tax-free income in retirement</li>
<li><strong>Do both:</strong> Many experts recommend splitting contributions for tax diversification</li>
<li><strong>Always get full match:</strong> Employer match is free money (typically 3-6%)</li>
</ul>

<h3>On Your Pay Stub</h3>
<ul>
<li>"401(k)" or "Pre-Tax Ret" reduces your taxable wages</li>
<li>"Roth 401(k)" or "Roth Ret" does NOT reduce taxable wages</li>
<li>Employer match usually doesn't appear on your stub (it goes directly to your account)</li>
</ul>`
  },

  // ── NEW HELP & FAQ ──────────────────────────────────────────
  {
    id: "lost-paystub-replacement",
    category: "help",
    title: "Lost Your Pay Stub? How to Get a Replacement",
    summary: "Step-by-step guide to obtaining a copy of a lost or missing pay stub from your employer or payroll provider.",
    readTime: "3 min",
    content: `<h2>How to Get a Replacement Pay Stub</h2>
<p>Pay stubs are critical for taxes, loan applications, and record keeping. If you've lost one, here's how to get it back.</p>

<h3>Option 1: Employer Payroll Portal</h3>
<p>Most companies use online payroll systems (ADP, Gusto, Paychex, Paylocity) where you can access all past pay stubs:</p>
<ol>
<li>Log into your employer's payroll portal</li>
<li>Navigate to "Pay History" or "Pay Statements"</li>
<li>Select the pay period you need</li>
<li>Download or print the PDF</li>
</ol>

<h3>Option 2: Contact HR or Payroll</h3>
<p>If you don't have portal access, contact your HR or payroll department directly. They are required to maintain records and can reissue pay stubs.</p>

<h3>Option 3: Former Employer</h3>
<p>Former employers must retain payroll records for 3-7 years depending on the state. Contact their HR department in writing. They cannot refuse to provide your records.</p>

<h3>Option 4: Bank Statements</h3>
<p>While not a pay stub, bank statements showing direct deposit amounts can serve as supplemental proof of income for some purposes.</p>

<h3>Option 5: IRS Wage Transcript</h3>
<p>Request a free Wage and Income Transcript from the IRS (Form 4506-T) showing all wages reported by your employer. This takes 5-10 business days and shows annual totals, not individual pay periods.</p>

<h3>How Long Must Employers Keep Records?</h3>
<ul>
<li><strong>Federal (FLSA):</strong> 3 years for payroll records</li>
<li><strong>IRS:</strong> 4 years for tax records</li>
<li><strong>California:</strong> 4 years</li>
<li><strong>New York:</strong> 6 years</li>
</ul>`
  },
  {
    id: "paystub-vs-w2",
    category: "help",
    title: "Pay Stub vs. W-2: What's the Difference?",
    summary: "Understanding the key differences between your pay stub and W-2, when you need each, and how they should match.",
    readTime: "4 min",
    content: `<h2>Pay Stub vs. W-2</h2>
<p>Both documents report your earnings and taxes, but they serve different purposes and cover different time periods.</p>

<h3>Key Differences</h3>
<table>
<tr><th>Feature</th><th>Pay Stub</th><th>W-2</th></tr>
<tr><td>Issued by</td><td>Employer (each pay period)</td><td>Employer (annually by Jan 31)</td></tr>
<tr><td>Period covered</td><td>Single pay period + YTD</td><td>Entire calendar year</td></tr>
<tr><td>Purpose</td><td>Proof of income, personal records</td><td>Tax filing with IRS</td></tr>
<tr><td>Details</td><td>Hours, rate, each deduction itemized</td><td>Summary totals in coded boxes</td></tr>
<tr><td>Copies to IRS</td><td>No</td><td>Yes (employer files Copy A)</td></tr>
<tr><td>Required by law</td><td>Most states (not all)</td><td>Yes (federal requirement)</td></tr>
</table>

<h3>When You Need a Pay Stub</h3>
<ul>
<li>Apartment rental applications</li>
<li>Loan and mortgage pre-approval</li>
<li>Verifying current income</li>
<li>Checking for payroll errors in real-time</li>
<li>Budgeting and financial planning</li>
</ul>

<h3>When You Need a W-2</h3>
<ul>
<li>Filing federal and state tax returns</li>
<li>Applying for financial aid (FAFSA)</li>
<li>Proving prior-year income</li>
<li>Social Security benefit calculations</li>
</ul>

<h3>How They Should Match</h3>
<p>Your last pay stub YTD totals should approximately match your W-2. Differences may occur because:</p>
<ul>
<li>Pre-tax deductions reduce W-2 Box 1 but not gross pay YTD</li>
<li>Imputed income (group term life over $50K) adds to W-2 but may not show on every stub</li>
<li>Third-party sick pay may appear on W-2 but not on regular pay stubs</li>
</ul>`
  },
  {
    id: "multiple-jobs-taxes",
    category: "help",
    title: "Working Multiple Jobs: How to Handle Taxes and Withholding",
    summary: "Tax implications of holding two or more jobs, including W-4 adjustments and avoiding underpayment.",
    readTime: "5 min",
    content: `<h2>Multiple Jobs and Taxes</h2>
<p>When you work multiple jobs, each employer withholds taxes independently — which often leads to <strong>underwithholding</strong> because neither employer accounts for your combined income pushing you into a higher bracket.</p>

<h3>The Problem</h3>
<p>If Job A pays $40,000 and Job B pays $30,000, each employer withholds as if you earn only their amount. But your combined $70,000 puts you in a higher bracket, and you may owe at tax time.</p>

<h3>Solutions</h3>

<h4>Option 1: W-4 Step 2(c) — Multiple Jobs Checkbox</h4>
<p>Check the box on both W-4s. This roughly halves the standard deduction and bracket widths, increasing withholding on both jobs. Works best when both jobs pay similar amounts.</p>

<h4>Option 2: W-4 Step 3 — Use the IRS Estimator</h4>
<p>The IRS Tax Withholding Estimator calculates exactly how much extra to withhold. Enter it as additional withholding on Step 4(c) of one W-4 (typically the lower-paying job).</p>

<h4>Option 3: W-4 Step 4(c) — Extra Withholding</h4>
<p>Manually specify an additional dollar amount per paycheck. Quick calculation:</p>
<ol>
<li>Use a tax calculator to estimate total annual tax on combined income</li>
<li>Subtract expected withholding from both jobs at standard rates</li>
<li>Divide the shortfall by remaining pay periods</li>
<li>Enter that amount on Step 4(c) of your lower-paying job's W-4</li>
</ol>

<h3>Social Security Considerations</h3>
<p>Each employer withholds Social Security tax independently. If combined wages exceed the wage base ($168,600), you may overpay. Claim the excess as a credit on your tax return (Form 1040, line 24/Schedule 3).</p>

<h3>State Tax Considerations</h3>
<p>If your jobs are in different states, you may need to file multiple state returns. Your resident state typically gives a credit for taxes paid to other states.</p>`
  },
  {
    id: "understanding-deduction-codes",
    category: "help",
    title: "Pay Stub Deduction Codes Explained: A-Z Reference",
    summary: "Decode every abbreviation and code on your pay stub, from FIT to OASDI to Vol Life.",
    readTime: "5 min",
    content: `<h2>Pay Stub Deduction Codes</h2>
<p>Pay stubs use abbreviations that can be confusing. Here's a comprehensive guide to the most common codes.</p>

<h3>Tax Codes</h3>
<table>
<tr><th>Code</th><th>Meaning</th><th>Description</th></tr>
<tr><td>FIT / FWT</td><td>Federal Income Tax / Federal Withholding Tax</td><td>Based on W-4 and income</td></tr>
<tr><td>SIT / SWT</td><td>State Income Tax / State Withholding Tax</td><td>Based on state form and income</td></tr>
<tr><td>OASDI / SS</td><td>Social Security Tax</td><td>6.2% up to wage base</td></tr>
<tr><td>MED / HI</td><td>Medicare Tax</td><td>1.45% (+ 0.9% over $200K)</td></tr>
<tr><td>FICA</td><td>Federal Insurance Contributions Act</td><td>Combined SS + Medicare</td></tr>
<tr><td>SDI / CASDI</td><td>State Disability Insurance</td><td>CA, HI, NJ, NY, RI</td></tr>
<tr><td>SUI / SUTA</td><td>State Unemployment Insurance</td><td>Some states deduct from employees</td></tr>
<tr><td>LIT / CITY</td><td>Local Income Tax</td><td>City or county income tax</td></tr>
</table>

<h3>Benefit Codes</h3>
<table>
<tr><th>Code</th><th>Meaning</th></tr>
<tr><td>MED / HLTH</td><td>Health/Medical insurance premium</td></tr>
<tr><td>DEN / DNTL</td><td>Dental insurance premium</td></tr>
<tr><td>VIS</td><td>Vision insurance premium</td></tr>
<tr><td>401K / RET</td><td>Retirement plan contribution</td></tr>
<tr><td>ROTH</td><td>Roth 401(k) contribution</td></tr>
<tr><td>HSA</td><td>Health Savings Account</td></tr>
<tr><td>FSA</td><td>Flexible Spending Account</td></tr>
<tr><td>DCFSA</td><td>Dependent Care FSA</td></tr>
<tr><td>GTL / LIFE</td><td>Group Term Life insurance</td></tr>
<tr><td>STD / LTD</td><td>Short/Long-Term Disability</td></tr>
<tr><td>AD&D</td><td>Accidental Death & Dismemberment</td></tr>
<tr><td>ESPP</td><td>Employee Stock Purchase Plan</td></tr>
<tr><td>TRAN / PARK</td><td>Transit/Parking commuter benefits</td></tr>
</table>

<h3>Earnings Codes</h3>
<table>
<tr><th>Code</th><th>Meaning</th></tr>
<tr><td>REG / SAL</td><td>Regular pay / Salary</td></tr>
<tr><td>OT / OTP</td><td>Overtime pay (1.5x)</td></tr>
<tr><td>DT</td><td>Double time pay (2x)</td></tr>
<tr><td>HOL</td><td>Holiday pay</td></tr>
<tr><td>VAC / PTO</td><td>Vacation / Paid Time Off</td></tr>
<tr><td>SICK</td><td>Sick leave pay</td></tr>
<tr><td>BON / BONUS</td><td>Bonus pay</td></tr>
<tr><td>COMM</td><td>Commission</td></tr>
<tr><td>RETRO</td><td>Retroactive pay adjustment</td></tr>
<tr><td>TIPS</td><td>Reported tips</td></tr>
</table>`
  },
  {
    id: "paystub-for-immigration",
    category: "help",
    title: "Pay Stubs for Immigration: Visa and Green Card Requirements",
    summary: "How pay stubs are used in immigration cases, what USCIS looks for, and how to ensure your stubs meet requirements.",
    readTime: "4 min",
    content: `<h2>Pay Stubs for Immigration</h2>
<p>Pay stubs are frequently required documents in immigration proceedings, from visa applications to green card petitions and naturalization.</p>

<h3>Common Immigration Uses</h3>
<ul>
<li><strong>H-1B petitions:</strong> Prove prevailing wage compliance</li>
<li><strong>I-485 (Green Card):</strong> Evidence of ongoing employment and income</li>
<li><strong>I-130/I-864 (Affidavit of Support):</strong> Sponsor must prove income at 125% of poverty line</li>
<li><strong>N-400 (Naturalization):</strong> Employment history verification</li>
<li><strong>L-1 transfers:</strong> Proof of specialized role and compensation</li>
<li><strong>O-1 (Extraordinary Ability):</strong> Evidence of high compensation</li>
</ul>

<h3>What USCIS Looks For</h3>
<ul>
<li>Employer name and address</li>
<li>Employee name matching petition/application</li>
<li>Pay period and pay date</li>
<li>Gross and net pay</li>
<li>YTD totals (to verify annual salary claims)</li>
<li>Job title (some stubs include this)</li>
<li>Consistent pay history (gaps raise questions)</li>
</ul>

<h3>Affidavit of Support (I-864) Income Requirements</h3>
<table>
<tr><th>Household Size</th><th>125% Poverty (2025)</th></tr>
<tr><td>2</td><td>$25,550</td></tr>
<tr><td>3</td><td>$32,188</td></tr>
<tr><td>4</td><td>$38,825</td></tr>
<tr><td>5</td><td>$45,463</td></tr>
<tr><td>6</td><td>$52,100</td></tr>
</table>

<h3>Tips for Immigration Submissions</h3>
<ul>
<li>Submit the most recent 3-6 months of consecutive pay stubs</li>
<li>Ensure name spelling matches exactly across all documents</li>
<li>Include both pay stubs AND a W-2 or tax return for corroboration</li>
<li>If self-employed, use 1099s, bank statements, and tax returns instead</li>
<li>Translated pay stubs (if not in English) require certified translation</li>
</ul>`
  },
  {
    id: "garnishments-explained",
    category: "help",
    title: "Wage Garnishments: Types, Limits, and Your Rights",
    summary: "What wage garnishments are, maximum amounts that can be garnished, and how to respond if your wages are garnished.",
    readTime: "5 min",
    content: `<h2>Wage Garnishments Explained</h2>
<p>A wage garnishment is a legal order requiring your employer to withhold a portion of your earnings and send it directly to a creditor or government agency.</p>

<h3>Types of Garnishments</h3>
<ul>
<li><strong>Child support:</strong> Most common type (up to 50-65% of disposable earnings)</li>
<li><strong>Federal student loans:</strong> Up to 15% of disposable earnings</li>
<li><strong>IRS tax levies:</strong> Amount varies based on filing status and dependents</li>
<li><strong>Consumer debt:</strong> Court-ordered for credit cards, medical bills, etc.</li>
<li><strong>State tax levies:</strong> Varies by state</li>
</ul>

<h3>Federal Garnishment Limits (Consumer Debt)</h3>
<p>Under Title III of the Consumer Credit Protection Act:</p>
<ul>
<li>Maximum: <strong>25% of disposable earnings</strong>, OR</li>
<li>Amount by which weekly disposable earnings exceed <strong>30x federal minimum wage</strong> ($217.50)</li>
<li>Whichever is <strong>less</strong> is the maximum garnishment</li>
</ul>

<h3>Garnishment Priority Order</h3>
<ol>
<li>Child support and alimony (highest priority)</li>
<li>Federal tax levies</li>
<li>Federal student loans</li>
<li>State tax levies</li>
<li>Consumer debt judgments</li>
</ol>

<h3>Your Rights</h3>
<ul>
<li><strong>Cannot be fired:</strong> Federal law prohibits termination for a single garnishment</li>
<li><strong>Right to challenge:</strong> You can contest the garnishment in court</li>
<li><strong>Exemptions:</strong> Some income is exempt (Social Security, disability, veterans' benefits)</li>
<li><strong>Head of household:</strong> Some states provide additional protection</li>
</ul>

<h3>On Your Pay Stub</h3>
<p>Garnishments appear as deductions, often labeled "Garnishment," "Child Support," "Tax Levy," or "Student Loan Garn." They are deducted after taxes but before voluntary deductions like 401(k).</p>

<h3>How to Stop a Garnishment</h3>
<ul>
<li>Pay the debt in full</li>
<li>Negotiate a payment plan with the creditor</li>
<li>File a claim of exemption with the court</li>
<li>File for bankruptcy (triggers automatic stay)</li>
<li>For student loans: Apply for income-driven repayment or deferment</li>
</ul>`
  },
];

export default ARTICLES;
