/* eslint-disable */

import { faker } from '@faker-js/faker';
import ArticlePageObject from '../pages/article.pageObject';
import ArticleFeedsPageObject from '../pages/articleFeeds.pageObject';
import EditorPageObject from '../pages/editor.pageObject';

const articlePage = new ArticlePageObject();
const articleFeedsPage = new ArticleFeedsPageObject();
const editorPage = new EditorPageObject();

describe('Conduit', () => {
  const user = {
    email: faker.internet.email(),
    username: faker.string.alpha({ length: 10 }),
    password: faker.internet.password(),
    article: {
      title: faker.lorem.sentence({ min: 3, max: 5 }),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(3)
    }
  };

  before(() => {
    cy.login(user.email, user.username, user.password);
  });

  it('should allow user to create an article', () => {
    cy.visit('/editor');

    editorPage.verifyUrl();
    editorPage.fillAndSubmitForm(
      user.article.title,
      user.article.description,
      user.article.body
    );

    articlePage.verifyArticleHeader(user.article.title);
    articlePage.verifyArticleBody(user.article.body);
  });

  it('should allow a user to delete an article', () => {
    cy.createArticle(
      user.article.title,
      user.article.description,
      user.article.body
    ).then(response => {
      const articleSlug = response.body.article.slug;
      cy.visit(`/article/${articleSlug}`);

      articlePage.verifyUrl(articleSlug);
      articlePage.verifyArticleHeader(user.article.title);
      articlePage.verifyArticleBody(user.article.body);

      articlePage.clickDeleteArticleButton();

      cy.on('window:alert', (alertMessage) => {
        expect(alertMessage).to.eq('Are you sure you want to delete this article?');
      });
      
      articleFeedsPage.verifyYourFeedTab();
      articleFeedsPage.verifyNoArticlesMessage();
    });
  });
});
