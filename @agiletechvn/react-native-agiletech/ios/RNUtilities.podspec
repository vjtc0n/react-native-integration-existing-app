
Pod::Spec.new do |s|
  s.name         = "RNUtilities"
  s.version      = "1.0.2"
  s.summary      = "RNUtilities"
  s.description  = <<-DESC
                  RNUtilities
                   DESC
  s.homepage     = "https://agiletech.vn"
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "anhtuank7c@hotmail.com" }
  s.platform     = :ios, "8.0"
  s.source       = { :git => "https://github.com/agiletechvn/react-native-agiletech.git", :tag => "master" }
  s.source_files  = "RNUtilities/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  s.dependency "zxcvbn-ios"
  #s.dependency "others"

end
