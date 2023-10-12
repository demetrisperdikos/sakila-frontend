const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const readHtmlFile = (fileName) => {
    return fs.readFileSync(path.resolve(__dirname, fileName), { encoding: 'utf-8' });
};

describe('Top 5 Rented Movies', () => {
    it('should display top 5 rented movies on the landing page', () => {
        const dom = new JSDOM(readHtmlFile('index.html'));
        const topRentedMovies = dom.window.document.getElementById('topRentedMovies');
        expect(topRentedMovies).not.toBeNull();
    });
});

describe('Search Movies by Name', () => {
    it('should display movies that match the search term', () => {
        const dom = new JSDOM(readHtmlFile('movies.html'));
        const searchInput = dom.window.document.getElementById('movieSearch');
        expect(searchInput).not.toBeNull();
    });
});

describe('View List of Customers', () => {
    it('should display a list of customers', () => {
        const dom = new JSDOM(readHtmlFile('customers.html'));
        const customerList = dom.window.document.getElementById('customerList');
        expect(customerList).not.toBeNull();
    });
});

describe('Edit Customer Details', () => {
    it('should allow editing of customer details', () => {
        const dom = new JSDOM(readHtmlFile('customers.html'));
        const editForm = dom.window.document.getElementById('editCustomerForm');
        expect(editForm).not.toBeNull();
    });
});

describe('Generate PDF Report', () => {
    it('should have a button to generate PDF report', () => {
        const dom = new JSDOM(readHtmlFile('report.html'));
        const generateReportBtn = dom.window.document.getElementById('generateReportBtn');
        expect(generateReportBtn).not.toBeNull();
    });
});
