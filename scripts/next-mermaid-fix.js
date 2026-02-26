hexo.extend.filter.register('after_post_render', function (data) {
    if (data.content) {
        // hexo-filter-mermaid-diagrams outputs "<pre class='mermaid'>...</pre>"
        // but NexT's tag reader expects "pre > .mermaid" which means "<pre><div class='mermaid'>...</div></pre>"
        data.content = data.content.replace(/<pre class="mermaid">([\s\S]*?)<\/pre>/g, '<pre><div class="mermaid">$1</div></pre>');
    }
    return data;
});
