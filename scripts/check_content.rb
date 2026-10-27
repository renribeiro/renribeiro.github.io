require 'date'
require 'json'
require 'pathname'
require 'yaml'

root = Pathname.new(__dir__).parent
errors = []
posts = {}
publication_count = 0

check_local = lambda do |value, source|
  next unless value.is_a?(String) && value.start_with?('/')

  path = value.split(/[?#]/, 2).first.delete_prefix('/')
  next if path.empty? || path.start_with?('posts/')

  errors << "#{source}: missing local file #{value}" unless (root / path).file?
end

Dir[root.join('_posts', '*.md')].sort.each do |file|
  source = Pathname.new(file).relative_path_from(root).to_s
  text = File.read(file)
  front_matter = text.match(/\A---\s*\n(.*?)\n---\s*\n/m)
  unless front_matter
    errors << "#{source}: missing YAML front matter"
    next
  end

  begin
    data = YAML.safe_load(front_matter[1], permitted_classes: [Date, Time])
  rescue Psych::Exception => error
    errors << "#{source}: invalid YAML: #{error.message}"
    next
  end
  slug = File.basename(file, '.md').sub(/\A\d{4}-\d{2}-\d{2}-/, '')
  posts[slug] = { source: source, data: data }

  errors << "#{source}: missing title" if data['title'].to_s.empty?
  publication = data['publication']
  next unless publication

  publication_count += 1
  authors = publication['authors'].is_a?(Array) ? publication['authors'] : []
  errors << "#{source}: missing publication year" unless publication['year'].is_a?(Integer)
  errors << "#{source}: missing authors" if authors.empty?
  errors << "#{source}: missing publication type" if publication['type'].to_s.empty?
  errors << "#{source}: missing publication venue" if publication['venue'].to_s.empty?
  if publication['highlight_author'] && !authors.include?(publication['highlight_author'])
    errors << "#{source}: highlighted author is absent from the author list"
  end

  (publication['affiliations'] || []).each do |affiliation|
    (affiliation['authors'] || []).each do |author|
      errors << "#{source}: affiliation lists unknown author #{author}" unless authors.include?(author)
    end
  end

  (publication['links'] || []).each do |link|
    errors << "#{source}: resource is missing a label or URL" if link['label'].to_s.empty? || link['url'].to_s.empty?
    check_local.call(link['url'], source)
  end

  text.scan(/\{%\s*include research-figure\.html\s+([^%]+)%\}/) do |match|
    attributes = match.first
    source_path = attributes[/\bsrc="([^"]+)"/, 1]
    alt = attributes[/\balt="([^"]*)"/, 1]
    errors << "#{source}: research figure needs a source and alt text" if source_path.to_s.empty? || alt.to_s.empty?
    check_local.call(source_path, source)
  end

  if (audio = data['narration_audio'])
    check_local.call(audio, source)
    sidecar = root / audio.sub(/\.[^.]+\z/, '.json').delete_prefix('/')
    if sidecar.file?
      begin
        metadata = JSON.parse(sidecar.read)
        chapters = metadata['chapters']
        errors << "#{source}: narration chapters are missing" unless chapters.is_a?(Array) && chapters.any?
        duration = metadata['duration']
        if duration.is_a?(Numeric) && duration.positive?
          expected_minutes = (duration / 60.0).ceil
          if data['narration_minutes'] != expected_minutes
            errors << "#{source}: narration_minutes should be #{expected_minutes} for #{sidecar.relative_path_from(root)}"
          end
        else
          errors << "#{source}: narration metadata needs a positive duration"
        end
      rescue JSON::ParserError => error
        errors << "#{source}: invalid narration metadata: #{error.message}"
      end
    else
      errors << "#{source}: missing narration metadata #{sidecar.relative_path_from(root)}"
    end
  end
end

posts.each_value do |post|
  (post[:data]['related_publications'] || []).each do |relation|
    errors << "#{post[:source]}: unknown related publication #{relation['slug']}" unless posts.key?(relation['slug'])
  end
end

YAML.load_file(root / '_data/news.yml').each do |item|
  url = item['url']
  next unless url&.start_with?('/posts/')

  slug = url.split('/')[2]
  errors << "_data/news.yml: unknown post #{url}" unless posts.key?(slug)
end

if errors.any?
  warn errors.join("\n")
  exit 1
end

puts "Checked #{publication_count} publications and news links."
