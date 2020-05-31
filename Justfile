fmt:
    prettier --write --tab-width 4 --print-width 120 static/js/

develop:
    zola --config config.local.toml serve
