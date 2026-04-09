"""
Module for extracting and matching skills
"""
import re

class SkillMatcher:
    """
    Skill extraction and matching class
    """
    
    def __init__(self):
        """Initialize with predefined skill list"""
        self.skills = {
            # Programming Languages
            'python': ['python'],
            'javascript': ['javascript', 'js'],
            'typescript': ['typescript', 'ts'],
            'java': ['java'],
            'c#': ['c#', 'csharp', 'c sharp'],
            'c++': ['c++', 'cpp'],
            'php': ['php'],
            'ruby': ['ruby'],
            'go': ['go', 'golang'],
            'rust': ['rust'],
            'kotlin': ['kotlin'],
            'swift': ['swift'],
            
            # Frontend Technologies
            'react': ['react', 'reactjs'],
            'angular': ['angular', 'angularjs'],
            'vue': ['vue', 'vuejs'],
            'svelte': ['svelte'],
            'html': ['html', 'html5'],
            'css': ['css', 'css3'],
            'tailwind': ['tailwind', 'tailwindcss'],
            'bootstrap': ['bootstrap'],
            'webpack': ['webpack'],
            'vite': ['vite'],
            
            # Backend Technologies
            'node': ['node', 'nodejs', 'node.js'],
            'express': ['express', 'expressjs'],
            'django': ['django'],
            'flask': ['flask'],
            'fastapi': ['fastapi'],
            'spring': ['spring', 'springboot', 'spring boot'],
            'asp.net': ['asp.net', 'aspnet'],
            'laravel': ['laravel'],
            
            # Databases
            'mongodb': ['mongodb', 'mongo'],
            'postgresql': ['postgresql', 'postgres'],
            'mysql': ['mysql'],
            'redis': ['redis'],
            'elasticsearch': ['elasticsearch'],
            'sqlite': ['sqlite'],
            'oracle': ['oracle'],
            'sql server': ['sql server', 'sqlserver', 'mssql'],
            'firestore': ['firestore'],
            'dynamodb': ['dynamodb'],
            
            # Cloud & DevOps
            'aws': ['aws', 'amazon web services'],
            'azure': ['azure', 'microsoft azure'],
            'gcp': ['gcp', 'google cloud', 'cloud platform'],
            'docker': ['docker'],
            'kubernetes': ['kubernetes', 'k8s'],
            'jenkins': ['jenkins'],
            'github': ['github'],
            'gitlab': ['gitlab'],
            'bitbucket': ['bitbucket'],
            'terraform': ['terraform'],
            'ansible': ['ansible'],
            
            # Testing & QA
            'jest': ['jest'],
            'mocha': ['mocha'],
            'pytest': ['pytest'],
            'selenium': ['selenium'],
            'cypress': ['cypress'],
            'unittest': ['unittest'],
            
            # Other Tools & Concepts
            'git': ['git', 'github', 'gitlab', 'bitbucket'],
            'linux': ['linux'],
            'rest api': ['rest', 'rest api', 'restful'],
            'graphql': ['graphql'],
            'websocket': ['websocket'],
            'microservices': ['microservices'],
            'agile': ['agile', 'scrum', 'kanban'],
            'ci/cd': ['ci/cd', 'cicd', 'continuous integration'],
            'machine learning': ['machine learning', 'ml', 'deep learning', 'ai', 'artificial intelligence'],
            'data analysis': ['data analysis', 'analytics', 'pandas', 'numpy'],
            'sql': ['sql'],
        }
    
    def extract_skills(self, text):
        """
        Extract skills from text
        
        Args:
            text: Text to search for skills
        
        Returns:
            list: List of found skills
        """
        text_lower = text.lower()
        found_skills = []
        
        for skill, keywords in self.skills.items():
            for keyword in keywords:
                # Use regex to match whole words only
                pattern = r'\b' + re.escape(keyword) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills.append(skill)
                    break  # Move to next skill after finding one keyword match
        
        return list(set(found_skills))  # Remove duplicates
