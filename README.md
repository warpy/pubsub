<h2>PubSub.js</h2>
<p>This is a library I wrote to demonstrate how the pub-sub mechanism can be used with complex topics. Usually, a pub-sub performs by accepting a string topic and a handler function (ex: <a href='https://github.com/mroderick/PubSubJS' target='_blank'>PubSubJS</a>). This library, however, accepts a more complex syntax in order to be able to optimize your subscriber chain. It even allows the use of javascript objects as triggers.</p>
<h4>Example Code</h4>
<h6>Subscribers</h6>
<ol>
  <li><code>PubSub.bind('sanket', fn)</code> single-variable - executes when <code>sanket</code> is triggered.</li>
  <li><code>PubSub.bind('!parab', fn)</code> single-variable with a <em>NOT</em> operand - executes each time <code>parab</code> is <em>NOT</em> triggered.</li>
  <li><code>PubSub.bind('sanket&amp;parab', fn)</code> multiple-variables with an <em>AND</em> operand - executes each time <code>sanket</code> <em>AND</em> <code>parab</code> are triggered.</li>
  <li><code>PubSub.bind('sanket|parab', fn)</code> multiple-variables with an <em>OR</em> operand - executes if either <code>sanket</code> <em>OR</em> <code>parab</code> or both are triggered.</li>
  <li><code>PubSub.bind('step=1&amp;name=sanket', fn)</code> multiple-variables with <em>key-values</em> and an <em>AND</em> operand - executes each time <code>step</code> is triggered with value <code>1</code> <em>AND</em> <code>name</code> is triggered with value <code>sanket</code></li>
  <li><code>PubSub.bind('step=2|name=parab', fn)</code> multiple-variables with <em>key-values</em> and an <em>OR</em> operand - executes each time <code>step</code> is triggered with value <code>2</code> <em>OR</em> <code>name</code> is triggered with value <code>parab</code></li>
  <li><code>PubSub.bind('step=1&amp;name!=sanket', fn)</code> multiple-variables with <em>key-values</em> and an <em>AND</em> along with a <em>NOT</em> operand - executes each time <code>step</code> is triggered with value <code>1</code> <em>AND</em> <code>name</code> is triggered with a value which is <em>NOT</em> <code>sanket</code></li>
  <li><code>PubSub.bind('step=2|name!=parab', fn)</code> multiple-variables with <em>key-values</em> and an <em>OR</em> along with a <em>NOT</em> operand - executes each time <code>step</code> is triggered with value <code>2</code> <em>OR</em> <code>name</code> is triggered with a value which is <em>NOT</em> <code>parab</code></li>
</ol>
<h6>Publishers</h6>
<ul>
  <li><code>PubSub.trigger('sanket')</code> single-topic string - will execute <code>#1</code>, <code>#2</code> and <code>#4</code></li>
  <li><code>PubSub.trigger('parab')</code> another single-topic string - will execute just <code>#4</code></li>
  <li><code>PubSub.trigger('garbage')</code> another single-topic string - will execute just <code>#2</code></li>
  <li><code>PubSub.trigger('sanket&amp;parab')</code> multiple-topic string with an <em>AND</em> connected operand - will execute just <code>#2</code></li>
  <li><code>PubSub.trigger('sanket parab')</code> multiple-topic string without a connection - will execute <code>#1</code>, <code>#3</code> and <code>#4</code></li>
  <li><code>PubSub.trigger({step: 1, name: 'sanket'})</code> object topic with multiple variables - will execute <code>#5</code> and <code>#8</code></li>
  <li><code>PubSub.trigger({step: '2'})</code> object topic with a single variable - will execute <code>#6</code> and <code>#8</code></li>
  <li><code>PubSub.trigger({step: 1, name: 'garbage'})</code> object topic with multiple variables - will execute <code>#7</code> and <code>#8</code></li>
</ul>
