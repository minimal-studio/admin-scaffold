find ./src -name "*.js" | sed 's/.js//' | xargs -n1 -I {} mv {}.js {}.tsx
