export default class ArticleFeedsPageObject {
  verifyNoArticlesMessage() {
    cy.get('.article-preview').should(
      'contain.text',
      'No articles are here... yet.'
    );
  }
};
