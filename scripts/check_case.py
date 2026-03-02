import os
import re

def get_real_names_in_dir(dirpath):
    try:
        return os.listdir(dirpath)
    except FileNotFoundError:
        return []

def check_imports():
    root_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src')
    errors = 0
    pattern = re.compile(r"""(?:import|from)\s+['"]([^'"]+)['"]""")
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.js') or filename.endswith('.jsx'):
                filepath = os.path.join(dirpath, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    matches = pattern.findall(content)
                    for match in matches:
                        # Ignore absolute or module imports
                        if not match.startswith('.'):
                            continue
                            
                        # Resolve path
                        target_path = os.path.normpath(os.path.join(dirpath, match))
                        target_dir = os.path.dirname(target_path)
                        target_base = os.path.basename(target_path)
                        
                        real_files = get_real_names_in_dir(target_dir)
                        if not real_files:
                            # Not strictly an error if directory missing if it's node module, but we only have local
                            pass
                            
                        # Check Exact case match or with extension
                        found = False
                        for rf in real_files:
                            # Match exact, or with .js, .jsx, .css extensions
                            if rf == target_base or rf == target_base + '.js' or rf == target_base + '.jsx' or rf == target_base + '.css':
                                found = True
                                break
                        
                        if not found and not os.path.isdir(target_path):
                            errors += 1
                            print(f"CASE ERROR in {filepath}: imported '{match}' (resolved base '{target_base}') not found in {target_dir}")
                            print(f"Directory {target_dir} contains: {real_files}")
                            print("-" * 40)
                            
    if errors == 0:
        print("No case-sensitivity errors found!")

if __name__ == '__main__':
    check_imports()
