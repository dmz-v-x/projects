const rootCommentForm = document.getElementById('rootCommentForm');
const rootAuthor = document.getElementById('rootAuthor');
const rootText = document.getElementById('rootText');
const commentList = document.getElementById('commentList');

const comments = [
  {
    id: crypto.randomUUID(),
    author: 'Himanshu',
    text: 'This is the first comment. Try replying to it.',
    createdAt: new Date(),
    replies: [
      {
        id: crypto.randomUUID(),
        author: 'Guest',
        text: 'Nice, nested comments are working.',
        createdAt: new Date(),
        replies: []
      }
    ]
  }
];

function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

function findCommentById(targetId, nodes = comments) {
  for (const node of nodes) {
    if (node.id === targetId) {
      return node;
    }

    const found = findCommentById(targetId, node.replies);
    if (found) {
      return found;
    }
  }

  return null;
}

function createReplyForm(commentId) {
  const wrap = document.createElement('div');
  wrap.className = 'reply-wrap hidden';

  const form = document.createElement('form');
  form.className = 'reply-form';

  const authorInput = document.createElement('input');
  authorInput.placeholder = 'Your name';
  authorInput.required = true;

  const textInput = document.createElement('textarea');
  textInput.rows = 2;
  textInput.placeholder = 'Write a reply...';
  textInput.required = true;

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Post Reply';

  form.append(authorInput, textInput, submitBtn);
  wrap.appendChild(form);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const parentComment = findCommentById(commentId);
    if (!parentComment) {
      return;
    }

    parentComment.replies.push({
      id: crypto.randomUUID(),
      author: authorInput.value.trim(),
      text: textInput.value.trim(),
      createdAt: new Date(),
      replies: []
    });

    renderComments();
  });

  return wrap;
}

function renderNode(comment) {
  const article = document.createElement('article');
  article.className = 'comment';

  const head = document.createElement('div');
  head.className = 'comment-head';

  const author = document.createElement('span');
  author.className = 'author';
  author.textContent = comment.author;

  const time = document.createElement('span');
  time.className = 'time';
  time.textContent = formatTime(comment.createdAt);

  head.append(author, time);

  const text = document.createElement('p');
  text.className = 'comment-text';
  text.textContent = comment.text;

  const actions = document.createElement('div');
  actions.className = 'actions';

  const replyBtn = document.createElement('button');
  replyBtn.type = 'button';
  replyBtn.textContent = 'Reply';

  actions.appendChild(replyBtn);

  const replyFormWrap = createReplyForm(comment.id);
  replyBtn.addEventListener('click', () => {
    replyFormWrap.classList.toggle('hidden');
  });

  article.append(head, text, actions, replyFormWrap);

  if (comment.replies.length > 0) {
    const childrenWrap = document.createElement('div');
    childrenWrap.className = 'children';

    comment.replies.forEach((reply) => {
      childrenWrap.appendChild(renderNode(reply));
    });

    article.appendChild(childrenWrap);
  }

  return article;
}

function renderComments() {
  commentList.innerHTML = '';
  comments.forEach((comment) => {
    commentList.appendChild(renderNode(comment));
  });
}

rootCommentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  comments.unshift({
    id: crypto.randomUUID(),
    author: rootAuthor.value.trim(),
    text: rootText.value.trim(),
    createdAt: new Date(),
    replies: []
  });

  rootCommentForm.reset();
  renderComments();
});

renderComments();
